import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TrafficCam from "./TrafficCam";
import { vi } from "vitest";
import * as fetchTrafficCamsModule from "../../apis/fetchTrafficCams";
import { TrafficWeather } from "../../apis/fetchTrafficCams";

const mockTrafficCamData = [
  {
    camera_id: "1",
    locationName: "Location 1",
    weatherForecast: "Sunny",
    image: "Image",
  } as unknown as TrafficWeather,
  {
    camera_id: 2,
    locationName: "Location 2",
    weatherForecast: "Rainy",
  } as unknown as TrafficWeather,
];

vi.mock("../../apis/fetchTrafficCams", () => ({
  fetchTrafficCamData: () => mockTrafficCamData,
}));
describe("TrafficCam", () => {
  afterEach(async () => {
    await vi.restoreAllMocks();
  });

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

  test("should fetches traffic data and enable location select box", async () => {
    render(<TrafficCam />);
    const datePicker = screen.getByTestId("datePicker");
    const timePicker = screen.getByTestId("timePicker");

    fireEvent.mouseDown(datePicker);
    fireEvent.change(datePicker, { target: { value: "2023-05-16" } });
    fireEvent.click(document.querySelectorAll(".ant-picker-cell-selected")[0]);
    fireEvent.mouseDown(timePicker);
    fireEvent.change(timePicker, { target: { value: "00:00:04" } });
    fireEvent.click(screen.getByText("OK"));

    const fetchButton = screen.getByText("Fetch traffic details");
    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(fetchButton).not.toBeDisabled();
      const selectBox = screen.getByTestId("locationDropdown");
      expect(selectBox).toBeInTheDocument();
      expect(selectBox.children.length).toBe(2);
      const selectedOption = screen.getByText("Location 1");
      expect(selectedOption).toBeInTheDocument();
    });

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "Location 2" } });

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Location 2/i })
      ).toBeInTheDocument();
    });
  });

  test("should be able to change selected location to different location", async () => {
    render(<TrafficCam />);
    const datePicker = screen.getByTestId("datePicker");
    const timePicker = screen.getByTestId("timePicker");

    fireEvent.mouseDown(datePicker);
    fireEvent.change(datePicker, { target: { value: "2023-05-16" } });
    fireEvent.click(document.querySelectorAll(".ant-picker-cell-selected")[0]);
    fireEvent.mouseDown(timePicker);
    fireEvent.change(timePicker, { target: { value: "00:00:04" } });
    fireEvent.click(screen.getByText("OK"));

    const fetchButton = screen.getByText("Fetch traffic details");
    fireEvent.click(fetchButton);

    await waitFor(() => {
      const selectElement = screen.getByRole("combobox");
      fireEvent.change(selectElement, { target: { value: "Location 2" } });
    });
    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: /Location 2/i })
      ).toBeInTheDocument();
    });
  });

  test("should display error notification on failed API call", async () => {
    const throwError = vi.fn().mockRejectedValueOnce(new Error("API Error"));

    vi.spyOn(fetchTrafficCamsModule, "fetchTrafficCamData").mockImplementation(
      throwError
    );
    render(<TrafficCam />);
    const datePicker = screen.getByTestId("datePicker");
    const timePicker = screen.getByTestId("timePicker");

    fireEvent.mouseDown(datePicker);
    fireEvent.change(datePicker, { target: { value: "2023-05-16" } });
    fireEvent.click(document.querySelectorAll(".ant-picker-cell-selected")[0]);
    fireEvent.mouseDown(timePicker);
    fireEvent.change(timePicker, { target: { value: "00:00:04" } });
    fireEvent.click(screen.getByText("OK"));
    const fetchButton = screen.getByText("Fetch traffic details");
    fireEvent.click(fetchButton);

    await waitFor(async () => {
      const errorNotification = await screen.findByText("Error");
      expect(errorNotification).toBeInTheDocument();
      expect(
        screen.getByText("Failed to fetch traffic cam data.")
      ).toBeInTheDocument();
    });
  });
});
