import { expect } from "chai";
import { ethers } from "hardhat";
import { VideoAccessControl } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("VideoAccessControl", function () {
  let videoAccessControl: VideoAccessControl;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    const VideoAccessControlFactory = await ethers.getContractFactory("VideoAccessControl");
    videoAccessControl = await VideoAccessControlFactory.deploy();
    await videoAccessControl.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await videoAccessControl.owner()).to.equal(owner.address);
    });

    it("Should start with no access grants", async function () {
      expect(await videoAccessControl.checkAccess(user1.address, 1)).to.be.false;
      expect(await videoAccessControl.totalAccessGrants(1)).to.equal(0);
    });
  });

  describe("Access Management", function () {
    it("Should grant access to a video", async function () {
      const videoId = 1;
      
      await videoAccessControl.grantAccess(user1.address, videoId);
      
      expect(await videoAccessControl.checkAccess(user1.address, videoId)).to.be.true;
      expect(await videoAccessControl.totalAccessGrants(videoId)).to.equal(1);
      expect(await videoAccessControl.userPurchaseCount(user1.address)).to.equal(1);
    });

    it("Should emit AccessGranted event", async function () {
      const videoId = 1;
      
      await expect(videoAccessControl.grantAccess(user1.address, videoId))
        .to.emit(videoAccessControl, "AccessGranted")
        .withArgs(user1.address, videoId, await time.latest() + 1);
    });

    it("Should not grant duplicate access", async function () {
      const videoId = 1;
      
      await videoAccessControl.grantAccess(user1.address, videoId);
      await videoAccessControl.grantAccess(user1.address, videoId); // Duplicate
      
      expect(await videoAccessControl.totalAccessGrants(videoId)).to.equal(1);
      expect(await videoAccessControl.userPurchaseCount(user1.address)).to.equal(1);
    });

    it("Should revoke access to a video", async function () {
      const videoId = 1;
      
      await videoAccessControl.grantAccess(user1.address, videoId);
      expect(await videoAccessControl.checkAccess(user1.address, videoId)).to.be.true;
      
      await videoAccessControl.revokeAccess(user1.address, videoId);
      expect(await videoAccessControl.checkAccess(user1.address, videoId)).to.be.false;
    });

    it("Should emit AccessRevoked event", async function () {
      const videoId = 1;
      
      await videoAccessControl.grantAccess(user1.address, videoId);
      
      await expect(videoAccessControl.revokeAccess(user1.address, videoId))
        .to.emit(videoAccessControl, "AccessRevoked")
        .withArgs(user1.address, videoId, await time.latest() + 1);
    });
  });

  describe("Batch Operations", function () {
    it("Should grant access to multiple users", async function () {
      const videoId = 1;
      const users = [user1.address, user2.address, user3.address];
      
      await videoAccessControl.grantAccessBatch(users, videoId);
      
      for (const user of users) {
        expect(await videoAccessControl.checkAccess(user, videoId)).to.be.true;
      }
      expect(await videoAccessControl.totalAccessGrants(videoId)).to.equal(3);
    });

    it("Should emit BatchAccessGranted event", async function () {
      const videoId = 1;
      const users = [user1.address, user2.address];
      
      await expect(videoAccessControl.grantAccessBatch(users, videoId))
        .to.emit(videoAccessControl, "BatchAccessGranted")
        .withArgs(users, videoId, await time.latest() + 1);
    });

    it("Should check access for multiple videos", async function () {
      const videoIds = [1, 2, 3];
      
      // Grant access to videos 1 and 3 only
      await videoAccessControl.grantAccess(user1.address, 1);
      await videoAccessControl.grantAccess(user1.address, 3);
      
      const accessStatus = await videoAccessControl.checkAccessBatch(user1.address, videoIds);
      
      expect(accessStatus[0]).to.be.true;  // Video 1
      expect(accessStatus[1]).to.be.false; // Video 2
      expect(accessStatus[2]).to.be.true;  // Video 3
    });
  });

  describe("Analytics", function () {
    it("Should track video analytics correctly", async function () {
      const videoId = 1;
      
      await videoAccessControl.grantAccess(user1.address, videoId);
      await videoAccessControl.grantAccess(user2.address, videoId);
      
      const analytics = await videoAccessControl.getVideoAnalytics(videoId);
      expect(analytics).to.equal(2);
    });

    it("Should track user analytics correctly", async function () {
      await videoAccessControl.grantAccess(user1.address, 1);
      await videoAccessControl.grantAccess(user1.address, 2);
      await videoAccessControl.grantAccess(user1.address, 3);
      
      const analytics = await videoAccessControl.getUserAnalytics(user1.address);
      expect(analytics).to.equal(3);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to grant access", async function () {
      await expect(
        videoAccessControl.connect(user1).grantAccess(user2.address, 1)
      ).to.be.revertedWithCustomError(videoAccessControl, "OwnableUnauthorizedAccount");
    });

    it("Should only allow owner to revoke access", async function () {
      await videoAccessControl.grantAccess(user1.address, 1);
      
      await expect(
        videoAccessControl.connect(user1).revokeAccess(user1.address, 1)
      ).to.be.revertedWithCustomError(videoAccessControl, "OwnableUnauthorizedAccount");
    });

    it("Should only allow owner to batch grant access", async function () {
      await expect(
        videoAccessControl.connect(user1).grantAccessBatch([user2.address], 1)
      ).to.be.revertedWithCustomError(videoAccessControl, "OwnableUnauthorizedAccount");
    });
  });

  describe("Input Validation", function () {
    it("Should reject zero address for user", async function () {
      await expect(
        videoAccessControl.grantAccess(ethers.ZeroAddress, 1)
      ).to.be.revertedWith("VideoAccessControl: Invalid user address");
    });

    it("Should reject zero video ID", async function () {
      await expect(
        videoAccessControl.grantAccess(user1.address, 0)
      ).to.be.revertedWith("VideoAccessControl: Invalid video ID");
    });

    it("Should reject empty users array in batch operation", async function () {
      await expect(
        videoAccessControl.grantAccessBatch([], 1)
      ).to.be.revertedWith("VideoAccessControl: Empty users array");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to emergency withdraw", async function () {
      // Send some ETH to the contract (shouldn't happen in normal operation)
      await owner.sendTransaction({
        to: await videoAccessControl.getAddress(),
        value: ethers.parseEther("1.0")
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await videoAccessControl.emergencyWithdraw();
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should only allow owner to emergency withdraw", async function () {
      await expect(
        videoAccessControl.connect(user1).emergencyWithdraw()
      ).to.be.revertedWithCustomError(videoAccessControl, "OwnableUnauthorizedAccount");
    });
  });
});

// Helper to get latest block timestamp
const time = {
  latest: async () => {
    const block = await ethers.provider.getBlock("latest");
    return block!.timestamp;
  }
};