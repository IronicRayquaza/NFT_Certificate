import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: "uploads/" });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

const FRONTEND_METADATA_PATH = path.join(__dirname, "../frontend/src/data/metadata.json");

// Upload Image to IPFS
async function uploadToIPFS(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const formData = new FormData();
  formData.append("file", fileStream);

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  );

  return `ipfs://${response.data.IpfsHash}`;
}

// Upload Metadata JSON to IPFS
async function uploadMetadataToIPFS(metadata) {
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  );
  return `ipfs://${response.data.IpfsHash}`;
}

// Handle Metadata Upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, description, hackathon } = req.body;
    const imagePath = req.file.path;

    // Upload image to IPFS
    const imageCID = await uploadToIPFS(imagePath);

    // Create Metadata JSON
    const metadata = { name, description, image: imageCID, hackathon };
    const metadataCID = await uploadMetadataToIPFS(metadata);

    // Update frontend metadata.json
    let existingMetadata = [];
    if (fs.existsSync(FRONTEND_METADATA_PATH)) {
      existingMetadata = JSON.parse(fs.readFileSync(FRONTEND_METADATA_PATH, "utf-8"));
    }
    existingMetadata.push({ name, description, image: imageCID, tokenURI: metadataCID });

    fs.writeFileSync(FRONTEND_METADATA_PATH, JSON.stringify(existingMetadata, null, 2));

    // Delete uploaded file after processing
    fs.unlinkSync(imagePath);

    res.json({ success: true, tokenURI: metadataCID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
