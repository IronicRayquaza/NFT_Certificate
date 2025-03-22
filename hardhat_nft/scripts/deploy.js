const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const HackathonCertificate = await hre.ethers.getContractFactory("HackathonCertificate");

  // Deploy the contract
  const contract = await HackathonCertificate.deploy();

  // Wait for the contract to be deployed
  await contract.waitForDeployment();

  // Get contract address
  console.log("HackathonCertificate deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
