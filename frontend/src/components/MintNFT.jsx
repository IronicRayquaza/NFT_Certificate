
// import { useState, useEffect } from "react";
// import { BrowserProvider, Contract } from "ethers";
// import "../styles/MintNFT.css";
// import contractABI from "../abi/HackathonCertificate.json";

// const MintNFT = () => {
//   const [provider, setProvider] = useState(null);
//   const [recipient, setRecipient] = useState("");
//   const [minting, setMinting] = useState(false);
//   const [message, setMessage] = useState("");
//   const [nftImage, setNftImage] = useState(null);
//   const [tokenId, setTokenId] = useState(null);

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

//       const tokenURI = "ipfs://bafkreigaqstowo4aky5niyahjhuejprvl2c76pye3kbodvkhri2eslf2hi";
//       const tx = await contract.mintCertificate(recipient, tokenURI);
//       const receipt = await tx.wait();

//       // Extract Token ID from event
//       const event = receipt.logs.find((e) => e.fragment.name === "Transfer");
//       if (!event) throw new Error("Minting event not found!");
//       const mintedTokenId = event.args.tokenId.toString();
//       setTokenId(mintedTokenId);

//       setMessage(`✅ NFT Minted Successfully! Token ID: ${mintedTokenId}`);

//       // Fetch NFT Metadata
//       const fetchedTokenURI = await contract.tokenURI(mintedTokenId);
//       const response = await fetch(fetchedTokenURI);
//       const metadata = await response.json();

//       setNftImage(metadata.image);
//     } catch (error) {
//       console.error("Minting error:", error);
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
//       <button onClick={handleMint} disabled={minting || !provider}>
//         {minting ? "Minting..." : "Mint NFT"}
//       </button>
//       <p>{message}</p>

//       {nftImage && (
//         <div>
//           <h3>Your Minted NFT</h3>
//           <img src={nftImage} alt="Minted NFT" width="300" />
//           <p>Token ID: {tokenId}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MintNFT;


import { useState, useEffect } from "react";
import { BrowserProvider, Wallet, Contract } from "ethers";
import "../styles/MintNFT.css";
import contractABI from "../abi/HackathonCertificate.json";

const MintNFT = () => {
  const [provider, setProvider] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [minting, setMinting] = useState(false);
  const [message, setMessage] = useState("");
  const [nftData, setNftData] = useState(null);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new BrowserProvider(window.ethereum));
    } else {
      setMessage("⚠️ Please install MetaMask.");
    }
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

      const tokenURI = "ipfs://bafkreigaqstowo4aky5niyahjhuejprvl2c76pye3kbodvkhri2eslf2hi";
      const tx = await contract.mintCertificate(recipient, tokenURI);
      const receipt = await tx.wait();

      setMessage(`✅ NFT Minted Successfully! Sent to: ${recipient}`);

      // Assuming `mintCertificate` returns a Token ID
      const tokenId = receipt.logs[0]?.topics[3]; 

      setNftData({
        image: "https://ipfs.io/ipfs/bafkreigaqstowo4aky5niyahjhuejprvl2c76pye3kbodvkhri2eslf2hi",
        recipient,
        tokenId,
        transactionHash: receipt.transactionHash,
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
      <h2>Mint Hackathon Winner NFT</h2>
      <input
        type="text"
        placeholder="Enter recipient wallet address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
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
            <strong>Transaction:</strong>{" "}
            <a
              href={`https://etherscan.io/tx/${nftData.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Etherscan
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MintNFT;
