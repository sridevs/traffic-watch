import React from "react";
import { Image } from "antd";
import { TrafficWeather } from "../../apis/fetchTrafficCams";

const TrafficImage = ({ camera }: {camera: TrafficWeather}) => {
  return (
    <div key={camera.camera_id} className={"image-section"}>
      <h3>Location: {camera.locationName}</h3>
      <Image src={camera.image} alt="Traffic Cam" width={400}/>
      <h4 style={{ color: "blue" }}>Click on Image to preview</h4>
    </div>
  );
};

export default TrafficImage;
