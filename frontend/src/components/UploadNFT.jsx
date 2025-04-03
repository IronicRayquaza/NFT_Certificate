import { useState } from "react";
import axios from "axios";
import "../styles/UploadNFT.css";

const UploadNFT = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hackathon, setHackathon] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("hackathon", hackathon);
    formData.append("image", image);

    try {
      setMessage("Uploading...");
      const response = await axios.post("http://localhost:5000/upload", formData);
      setMessage(`Uploaded! Metadata URI: ${response.data.tokenURI}`);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  };

  return (
    <div>
      <h2>Upload Hackathon NFT</h2>
      <form onSubmit={handleUpload}>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Hackathon Name" onChange={(e) => setHackathon(e.target.value)} required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UploadNFT;
