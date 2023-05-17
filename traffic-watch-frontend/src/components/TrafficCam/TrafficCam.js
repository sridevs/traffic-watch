import React, { useState } from "react";
import { Button, notification, Select, Spin, Card } from "antd";
import { fetchTrafficCamData } from "../../apis/fetchTrafficCams.js";
import "./TrafficCam.css";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import TrafficImage from "../TrafficImage/TrafficImage";

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
      <header className="header">Traffic Watch</header>
      <div className={"input-section"}>
        <DateTimePicker
          onDateChange={(date) => setDate(date)}
          onTimeChange={(time) => setTime(time)}
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
        <div style={{ background: "cadetblue" }}>
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
                  <div className={"display-section"}>
                    <TrafficImage key={camera.camera_id} camera={camera} />
                    <Card title="Weather" bordered={false}>
                      <h2>{camera.weatherForecast}</h2>
                    </Card>
                  </div>
                ))}
          </div>
        </div>
      )}
      <footer className="footer">Copyright@2023</footer>
    </div>
  );
};

export default TrafficCam;
