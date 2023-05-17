import React from "react";
import { render, screen } from "@testing-library/react";
import DateTimePicker from "./DateTimePicker";

describe("DateTimePicker", () => {
  it("should render the date and time pickers", () => {
    render(<DateTimePicker />);

    const datePicker = screen.getByTestId("datePicker");
    const timePicker = screen.getByTestId("timePicker");

    expect(datePicker).toBeInTheDocument();
    expect(timePicker).toBeInTheDocument();
  });
});
