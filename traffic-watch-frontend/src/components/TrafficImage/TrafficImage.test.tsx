import React from "react";
import { render, screen } from "@testing-library/react";
import TrafficImage from "./TrafficImage";
import { TrafficWeather } from "../../apis/fetchTrafficCams";

describe("TrafficImage", () => {
  it("should render the traffic image with the correct camera information", () => {
    const camera = {
      camera_id: "123",
      locationName: "Example Location",
      image: "example.jpg",
    } as TrafficWeather;

    render(<TrafficImage camera={camera} />);

    const locationElement = screen.getByText("Location: Example Location") as HTMLElement;
    const imageElement = screen.getByAltText("Traffic Cam") as HTMLImageElement;

    expect(locationElement).toBeInTheDocument();
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", "example.jpg");
    expect(imageElement).toHaveAttribute("width", "400");
  });
});