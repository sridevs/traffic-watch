import React from "react";
import { DatePicker, TimePicker } from "antd";

const DateTimePicker = ({ onDateChange, onTimeChange }) => {
  return (
    <div>
      <DatePicker data-testid="datePicker" onChange={onDateChange} />
      <TimePicker
        data-testid="timePicker"
        onChange={onTimeChange}
        format="HH:mm:ss"
      />
    </div>
  );
};

export default DateTimePicker;
