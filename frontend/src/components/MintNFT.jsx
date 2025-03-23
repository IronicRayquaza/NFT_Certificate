import { useState, useEffect } from "react";
import { BrowserProvider, Wallet, Contract } from "ethers";
import "../styles/MintNFT.css";
import contractABI from "../abi/HackathonCertificate.json";
// const contractABI = contractFile.abi;

const MintNFT = () => {
  const [provider, setProvider] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [minting, setMinting] = useState(false);
  const [message, setMessage] = useState("");

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const privateKey = import.meta.env.VITE_PRIVATE_KEY;

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
      await tx.wait();

      setMessage(`✅ NFT Minted Successfully! Sent to: ${recipient}`);
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
    </div>
  );
};

export default MintNFT;
