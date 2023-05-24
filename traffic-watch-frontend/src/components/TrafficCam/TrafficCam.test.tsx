import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TrafficCam from "./TrafficCam";
import { vi } from "vitest";

vi.mock("../../apis/fetchTrafficCams", () => ({
  fetchTrafficCamData: vi.fn(),
}));

describe("TrafficCam", () => {
  test("renders TrafficCam component", () => {
    render(<TrafficCam />);

    expect(screen.getByText("Traffic Watch")).toBeInTheDocument();
  });

  test("disables fetch button when date or time is not selected", () => {
    render(<TrafficCam />);

    const fetchButton = screen.getByRole("button");
    expect(fetchButton).toBeDisabled();

    const datePicker = screen.getByTestId("datePicker");

    fireEvent.change(datePicker, { target: { value: "2023-05-16" } });
    expect(fetchButton).toBeDisabled();
  });

  test("should not render the location select box before fetching the traffic data", async () => {
    render(<TrafficCam />);

    const selectBox = screen.queryByTestId("locationDropdown");
    expect(selectBox).not.toBeInTheDocument();
  });
});
