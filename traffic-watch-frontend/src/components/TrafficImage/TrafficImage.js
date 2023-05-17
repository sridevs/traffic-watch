import React from "react";
import { Image } from "antd";

const TrafficImage = ({ camera }) => {
  return (
    <div key={camera.camera_id} className={"image-section"}>
      <h3>Location: {camera.locationName}</h3>
      <Image src={camera.image} alt="Traffic Cam" width={800} padding={10} />
    </div>
  );
};

export default TrafficImage;
