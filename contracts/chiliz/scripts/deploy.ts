import { ethers } from "hardhat";
import { VideoAccessControl } from "../typechain-types";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Deploying VideoAccessControl to Chiliz Spicy Testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "CHZ");

  if (balance === 0n) {
    console.error("❌ Insufficient balance! Please fund your account with CHZ tokens from the faucet:");
    console.error("🔗 https://spicy-faucet.chiliz.com/");
    process.exit(1);
  }

  // Deploy the contract
  console.log("📦 Deploying VideoAccessControl contract...");
  const VideoAccessControlFactory = await ethers.getContractFactory("VideoAccessControl");
  
  const videoAccessControl: VideoAccessControl = await VideoAccessControlFactory.deploy();
  await videoAccessControl.waitForDeployment();

  const contractAddress = await videoAccessControl.getAddress();
  console.log("✅ VideoAccessControl deployed to:", contractAddress);

  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await videoAccessControl.deploymentTransaction()?.wait(3);

  // Verify contract ownership
  const owner = await videoAccessControl.owner();
  console.log("👤 Contract owner:", owner);
  console.log("✅ Owner verification:", owner === deployer.address ? "PASS" : "FAIL");

  // Save deployment info
  const deploymentInfo = {
    network: "chilizSpicy",
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    gasUsed: videoAccessControl.deploymentTransaction()?.gasLimit?.toString(),
    transactionHash: videoAccessControl.deploymentTransaction()?.hash
  };

  // Save to JSON file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, "VideoAccessControl-chilizSpicy.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Copy ABI to API directory
  const artifactPath = path.join(__dirname, "../artifacts/contracts/VideoAccessControl.sol/VideoAccessControl.json");
  const apiContractsDir = path.join(__dirname, "../../../apps/api/src/contracts");
  
  if (!fs.existsSync(apiContractsDir)) {
    fs.mkdirSync(apiContractsDir, { recursive: true });
  }

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiFile = path.join(apiContractsDir, "VideoAccessControl.json");
    
    fs.writeFileSync(abiFile, JSON.stringify({
      address: contractAddress,
      abi: artifact.abi
    }, null, 2));
    
    console.log("📋 ABI copied to API directory:", abiFile);
  }

  // Display next steps
  console.log("\n🎉 Deployment Complete!");
  console.log("📋 Next Steps:");
  console.log(`1. Add this to your .env file:`);
  console.log(`   CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=${contractAddress}`);
  console.log(`2. Update your API configuration to use the deployed contract`);
  console.log(`3. Verify the contract on ChiliScan (optional):`);
  console.log(`   npx hardhat verify --network chilizSpicy ${contractAddress}`);
  console.log(`4. View on explorer: https://testnet.chiliscan.com/address/${contractAddress}`);

  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  try {
    // Test granting access
    const testUser = "0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"; // Random test address
    const testVideoId = 1;

    console.log(`📝 Granting access to user ${testUser} for video ${testVideoId}...`);
    const grantTx = await videoAccessControl.grantAccess(testUser, testVideoId);
    await grantTx.wait();
    
    // Check access
    const hasAccess = await videoAccessControl.checkAccess(testUser, testVideoId);
    console.log(`✅ Access check result: ${hasAccess}`);
    
    // Get analytics
    const videoAnalytics = await videoAccessControl.getVideoAnalytics(testVideoId);
    const userAnalytics = await videoAccessControl.getUserAnalytics(testUser);
    console.log(`📊 Video analytics: ${videoAnalytics} total grants`);
    console.log(`📊 User analytics: ${userAnalytics} total purchases`);
    
    console.log("✅ Basic functionality test passed!");
  } catch (error) {
    console.error("❌ Basic functionality test failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });