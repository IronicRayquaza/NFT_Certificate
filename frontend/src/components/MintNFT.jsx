

// import { useState, useEffect } from "react";
// import { BrowserProvider, Contract } from "ethers";
// import metadata from "../data/metadata.json";
// import "../styles/MintNFT.css";
// import contractABI from "../abi/HackathonCertificate.json";

// const MintNFT = () => {
//   const [provider, setProvider] = useState(null);
//   const [recipient, setRecipient] = useState("");
//   const [minting, setMinting] = useState(false);
//   const [message, setMessage] = useState("");
//   const [nftData, setNftData] = useState(null);
//   const [selectedHackathon, setSelectedHackathon] = useState(0);

//   const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

//   useEffect(() => {
//     if (window.ethereum) {
//       setProvider(new BrowserProvider(window.ethereum));
//     } else {
//       setMessage("⚠️ Please install MetaMask.");
//     }
//   }, []);

//   const handleMint = async () => {
//     if (!provider) {
//       setMessage("⚠️ No Ethereum provider found. Install MetaMask.");
//       return;
//     }

//     try {
//       setMinting(true);
//       setMessage("⏳ Minting NFT...");

//       const signer = await provider.getSigner();
//       const contract = new Contract(contractAddress, contractABI, signer);

//       // Get selected hackathon metadata
//       const hackathon = metadata.hackathons[selectedHackathon];

//       const tx = await contract.mintCertificate(recipient, hackathon.metadataURI);
//       const receipt = await tx.wait();

//       // Extract tokenId from event logs
//       const tokenId = parseInt(receipt.logs[0].topics[3], 16);

//       setMessage(`✅ NFT Minted Successfully for ${hackathon.name}! Sent to: ${recipient}`);

//       setNftData({
//         image: hackathon.image,
//         recipient,
//         tokenId,
//       });
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Minting Failed! Check console for details.");
//     } finally {
//       setMinting(false);
//     }
//   };

//   return (
//     <div className="mint-container">
//       <h2>Mint Hackathon Winner NFT</h2>
//       <input
//         type="text"
//         placeholder="Enter recipient wallet address"
//         value={recipient}
//         onChange={(e) => setRecipient(e.target.value)}
//       />
      
//       {/* Dropdown to Select Hackathon */}
//       <select onChange={(e) => setSelectedHackathon(e.target.value)}>
//         {metadata.hackathons.map((hackathon, index) => (
//           <option key={index} value={index}>{hackathon.name}</option>
//         ))}
//       </select>

//       <button onClick={handleMint} disabled={minting || !provider}>
//         {minting ? "Minting..." : "Mint NFT"}
//       </button>
//       <p>{message}</p>

//       {/* Display NFT Details */}
//       {nftData && (
//         <div className="nft-details">
//           <h3>🎨 Minted NFT</h3>
//           <img src={nftData.image} alt="NFT" width="200px" />
//           <p><strong>Token ID:</strong> {nftData.tokenId}</p>
//           <p><strong>Recipient:</strong> {nftData.recipient}</p>
//           <p>
//             <strong>View on OpenSea:</strong>{" "}
//             <a
//               href={`https://testnets.opensea.io/assets/sepolia/${contractAddress}/${nftData.tokenId}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               OpenSea Testnet
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MintNFT;

import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import metadata from "../data/metadata.json";
import contractABI from "../abi/HackathonCertificate.json";
import "../styles/MintNFT.css";

const MintNFT = () => {
  const [provider, setProvider] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [minting, setMinting] = useState(false);
  const [message, setMessage] = useState("");
  const [nftData, setNftData] = useState(null);
  const [selectedNFT, setSelectedNFT] = useState(metadata.hackathons[0]); // ✅ FIXED

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  useEffect(() => {
    if (window.ethereum) setProvider(new BrowserProvider(window.ethereum));
    else setMessage("⚠️ Please install MetaMask.");
  }, []);

  const handleMint = async () => {
    if (!provider) {
      setMessage("⚠️ No Ethereum provider found. Install MetaMask.");
      return;
    }

    try {
      setMinting(true);
      setMessage("⏳ Minting NFT...");

      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const tx = await contract.mintCertificate(recipient, selectedNFT.metadataURI);
      const receipt = await tx.wait();

      // Extract tokenId from event logs
      const tokenId = parseInt(receipt.logs[0].topics[3], 16);

      setMessage(`✅ NFT Minted Successfully for ${selectedNFT.name}! Sent to: ${recipient}`);

      setNftData({
        image: selectedNFT.image,
        recipient,
        tokenId,
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Minting Failed! Check console for details.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="mint-container">
      <h2>Mint Hackathon NFT</h2>
      <input
        type="text"
        placeholder="Enter recipient wallet address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      
      {/* Dropdown to Select NFT */}
      <select onChange={(e) => setSelectedNFT(metadata.hackathons[e.target.value])}>
        {metadata.hackathons.map((nft, index) => (
          <option key={index} value={index}>{nft.name}</option>
        ))}
      </select>

      <button onClick={handleMint} disabled={minting || !provider}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      <p>{message}</p>

      {/* Display NFT Details */}
      {nftData && (
        <div className="nft-details">
          <h3>🎨 Minted NFT</h3>
          <img src={nftData.image} alt="NFT" width="200px" />
          <p><strong>Token ID:</strong> {nftData.tokenId}</p>
          <p><strong>Recipient:</strong> {nftData.recipient}</p>
          <p>
            <strong>View on OpenSea:</strong>{" "}
            <a
              href={`https://testnets.opensea.io/assets/sepolia/${contractAddress}/${nftData.tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenSea Testnet
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MintNFT;
