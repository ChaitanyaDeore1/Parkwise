import { useEffect, useRef } from 'react';
import { animate, useMotionValue, useTransform } from 'framer-motion';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: Props) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (v) =>
    `${prefix}${v.toLocaleString('en-IN', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })}${suffix}`
  );
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [value]);

  useEffect(() => {
    return rounded.on('change', (v) => {
      if (spanRef.current) spanRef.current.textContent = v;
    });
  }, [rounded]);

  return <span ref={spanRef} className="tabular-nums">{`${prefix}${value}${suffix}`}</span>;
}
