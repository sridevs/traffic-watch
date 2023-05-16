import React, { useState } from 'react';
import { Button, DatePicker, notification, Spin, TimePicker } from 'antd';
import { fetchTrafficCamData } from "../apis/fetchTrafficCams.js";

const TrafficCam = () => {
    const BASE_URL = 'http://localhost:3000/traffic-watch';

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [trafficCams, setTrafficCams] = useState([]);

    const getTrafficCams = async () => {
        if (!date || !time) return;

        setLoading(true);

        try {
            const response = await fetchTrafficCamData(BASE_URL, date, time);
            setTrafficCams(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            notification.error({
                message: 'Error',
                description: 'Failed to fetch traffic cam data.',
            });
        }
    };

    return (
        <div>
            <h1>Traffic Images</h1>
            <div>
                <DatePicker data-testid = "datePicker" onChange={(date) => setDate(date)} />
                <TimePicker data-testid= "timePicker" onChange={(time) => setTime(time)} format="HH:mm:ss" />
                <Button
                    type="primary"
                    onClick={getTrafficCams}
                    disabled={!date || !time}
                >
                    Fetch traffic details
                </Button>
            </div>
            {loading ? (
                <Spin data-testid = "spinner"/>
            ) : (
                <div>
                    {trafficCams.map((trafficCam) => (
                        <div key={trafficCam.timestamp}>
                            <h2>Timestamp: {trafficCam.timestamp}</h2>
                            {trafficCam.cameras.map((camera) => (
                                <div key={camera.camera_id}>
                                    <h3>Camera ID: {camera.camera_id}</h3>
                                    <img src={camera.image} alt="Traffic Cam" />
                                    <p>
                                        Latitude: {camera.location.latitude}, Longitude:{' '}
                                        {camera.location.longitude}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrafficCam;