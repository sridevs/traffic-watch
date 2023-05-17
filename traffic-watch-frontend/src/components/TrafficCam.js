import React, { useState } from "react";
import {
  Button,
  DatePicker,
  notification,
  Select,
  Spin,
  TimePicker,
} from "antd";
import { fetchTrafficCamData } from "../apis/fetchTrafficCams.js";
import "./TrafficCam.css";

const TrafficCam = () => {
  const BASE_URL = "http://localhost:3000/traffic-watch";

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trafficCams, setTrafficCams] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationDropdownEnabled, setLocationDropdownEnabled] = useState(false);

  const getTrafficCams = async () => {
    if (!date || !time) return;

    setLoading(true);

    try {
      const response = await fetchTrafficCamData(BASE_URL, date, time);
      setTrafficCams(response.data);
      setLoading(false);
      setSelectedLocation(response.data[0].locationName);
      setLocationDropdownEnabled(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      notification.error({
        message: "Error",
        description: "Failed to fetch traffic cam data.",
      });
    }
  };

  const handleLocationSelect = (value) => {
    setSelectedLocation(value);
  };

  return (
    <div>
      <h1>Traffic Images</h1>
      <div>
        <DatePicker
          data-testid="datePicker"
          onChange={(date) => setDate(date)}
        />
        <TimePicker
          data-testid="timePicker"
          onChange={(time) => setTime(time)}
          format="HH:mm:ss"
        />
        <Button
          type="primary"
          onClick={getTrafficCams}
          disabled={!date || !time}
        >
          Fetch traffic details
        </Button>
      </div>
      {loading ? (
        <Spin data-testid="spinner" />
      ) : (
        <div>
          {locationDropdownEnabled ? (
            <Select
              value={selectedLocation}
              onChange={handleLocationSelect}
              style={{ width: 200, marginBottom: 16 }}
              options={trafficCams.map(({ locationName }) => ({
                value: locationName,
                label: locationName,
              }))}
              data-testid={"locationDropdown"}
            ></Select>
          ) : null}
          <div>
            {selectedLocation &&
              trafficCams
                .filter((camera) => camera.locationName === selectedLocation)
                .map((camera) => (
                  <div key={camera.camera_id}>
                    <h3>Location: {camera.locationName}</h3>
                    <img src={camera.image} alt="Traffic Cam" />
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficCam;
