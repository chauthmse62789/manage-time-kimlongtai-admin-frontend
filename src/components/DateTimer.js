import React from 'react';
import { useTime } from 'react-timer-hook';

function DateTimer() {
  const {
    seconds,
    minutes,
    hours,
    ampm,
  } = useTime({ format: '24-hour'});

  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '40px'}}>
      Giờ Hệ Thống: <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span><span>{ampm}</span>
      </div>
    </div>
  );
}

export default DateTimer