import React, { useState } from "react";
import { Button, notification, Select, Spin, Card } from "antd";
import {fetchTrafficCamData, TrafficWeather} from "../../apis/fetchTrafficCams";
import "./TrafficCam.css";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import TrafficImage from "../TrafficImage/TrafficImage";
import { Moment } from "moment";

const TrafficCam: React.FC = () => {
  const BASE_URL = "http://localhost:3000/traffic-watch";

  const [date, setDate] = useState<Moment | null>(null);
  const [time, setTime] = useState<Moment | null>(null);
  const [loading, setLoading] = useState(false);
  const [trafficCams, setTrafficCams] = useState<TrafficWeather[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationDropdownEnabled, setLocationDropdownEnabled] = useState(false);

  const getTrafficCams = async () => {
    if (!date || !time) return;

    setLoading(true);

    try {
      const trafficWeather = await fetchTrafficCamData(BASE_URL, date, time);
      setTrafficCams(trafficWeather);
      setLoading(false);
      setSelectedLocation(trafficWeather[0].locationName);
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

  const handleLocationSelect = (value: string) => {
    setSelectedLocation(value);
  };

  return (
      <div>
        <header className="header">Traffic Watch</header>
        <div className={"input-section"}>
          <DateTimePicker
              onDateChange={(date: React.SetStateAction<Moment | null>) => setDate(date)}
              onTimeChange={(time: React.SetStateAction<Moment | null>) => setTime(time)}
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
                            <div className={"display-section"} key={camera.camera_id}>
                              <TrafficImage camera={camera} />
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
