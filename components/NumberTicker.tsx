import React, { useState, useEffect, useRef } from 'react';

interface NumberTickerProps {
    value: number;
    precision?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    duration?: number;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
    value,
    precision = 0,
    prefix = '',
    suffix = '',
    className = '',
    duration = 500,
}) => {
    const [displayValue, setDisplayValue] = useState(value);
    const previousValue = useRef(value);
    const startTime = useRef<number | null>(null);
    const requestRef = useRef<number>();

    useEffect(() => {
        const startValue = previousValue.current;
        const endValue = value;

        if (startValue === endValue) return;

        const animate = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = timestamp - startTime.current;
            const percentage = Math.min(progress / duration, 1);

            // Easing function: easeOutExpo
            const easing = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            const current = startValue + (endValue - startValue) * easing;
            setDisplayValue(current);

            if (percentage < 1) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                previousValue.current = endValue;
                startTime.current = null;
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            startTime.current = null;
        };
    }, [value, duration]);

    return (
        <span className={className}>
            {prefix}
            {displayValue.toLocaleString(undefined, {
                minimumFractionDigits: precision,
                maximumFractionDigits: precision,
            })}
            {suffix}
        </span>
    );
};
