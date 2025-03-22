const hre = require("hardhat");

async function main() {
  const contractAddress = "0x502e6f7CD4deC3Af2B7cD9AD978B6f87798372B9"; 
  const recipient = "0x8c6E29359e5b783739073613858e55abeB71fe79"; 
  const tokenURI = "ipfs://bafkreigaqstowo4aky5niyahjhuejprvl2c76pye3kbodvkhri2eslf2hi"; 

  // Get contract instance
  const HackathonCertificate = await hre.ethers.getContractFactory("HackathonCertificate");
  const contract = await HackathonCertificate.attach(contractAddress);

  // Call mintCertificate function
  const tx = await contract.mintCertificate(recipient, tokenURI);
  await tx.wait();

  console.log(`NFT Minted! Token assigned to: ${recipient}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
