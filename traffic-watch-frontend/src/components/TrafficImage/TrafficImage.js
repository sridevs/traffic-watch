import React from "react";
import { Image } from "antd";

const TrafficImage = ({ camera }) => {
  return (
    <div key={camera.camera_id} className={"image-section"}>
      <h3>Location: {camera.locationName}</h3>
      <Image src={camera.image} alt="Traffic Cam" width={400} padding={10} />
      <h4 style={{ color: "blue" }}>Click on Image to preview</h4>
    </div>
  );
};

export default TrafficImage;
