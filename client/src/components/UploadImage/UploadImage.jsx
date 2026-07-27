import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./UploadImage.css";
import { Button, Group, TextInput } from "@mantine/core";

const UploadImage = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  prevStep,
}) => {
  const [imageURL, setImageURL] = useState(propertyDetails.image);

  const handleNext = () => {
    setPropertyDetails((prev) => ({ ...prev, image: imageURL }));
    nextStep();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flexColCenter uploadWrapper" style={{ width: "100%" }}>
      {!imageURL ? (
        <label className="flexColCenter uploadZone" style={{ cursor: "pointer", width: "100%" }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <AiOutlineCloudUpload size={50} color="grey" />
          <span>Click to Upload Local Image</span>
        </label>
      ) : (
        <div className="uploadedImage" style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
          <img src={imageURL} alt="Property" style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "10px" }} />
          <Button 
            variant="filled" 
            color="red" 
            size="xs"
            style={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => setImageURL("")}
          >
            Remove
          </Button>
        </div>
      )}

      <TextInput
        placeholder="Or paste an image URL here..."
        label="Or Use Image URL"
        value={(imageURL && typeof imageURL === "string" && imageURL.startsWith("data:")) ? "" : (imageURL || "")}
        onChange={(e) => setImageURL(e.target.value)}
        style={{ width: "100%", marginTop: "1rem" }}
      />

      <Group position="center" mt={"xl"}>
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!imageURL}>
          Next
        </Button>
      </Group>
    </div>
  );
};

export default UploadImage;
