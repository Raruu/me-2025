"use client";
import { useEffect, useState } from "react";

interface ClockProps {
  fontSize?: number;
}

const Clock = ({ fontSize = 16 }: ClockProps) => {
  const [time, setTime] = useState<Date>();

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p style={{ fontSize: fontSize }}>
        {time ? `${time.getDate()} ${time.toLocaleString('default', { month: 'short' })} ${time.toLocaleTimeString()}` : ". . ."}
      </p>
    </div>
  );
};

export { Clock };
