// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VideoAccessControl
 * @dev Smart contract for managing access to premium video content on ScoutyStream
 * @notice This contract allows the platform to grant and revoke access to specific videos for users
 */
contract VideoAccessControl is Ownable, ReentrancyGuard {
    // Mapping from videoId to user address to access status
    mapping(uint256 => mapping(address => bool)) public hasAccess;
    
    // Mapping to track total access grants per video (for analytics)
    mapping(uint256 => uint256) public totalAccessGrants;
    
    // Mapping to track user's total video purchases (for analytics)
    mapping(address => uint256) public userPurchaseCount;

    // Events
    event AccessGranted(address indexed user, uint256 indexed videoId, uint256 timestamp);
    event AccessRevoked(address indexed user, uint256 indexed videoId, uint256 timestamp);
    event BatchAccessGranted(address[] users, uint256 indexed videoId, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    // Allow contract to receive ETH (for emergency withdraw testing)
    receive() external payable {}

    /**
     * @dev Grant access to a video for a specific user
     * @param user The address of the user to grant access to
     * @param videoId The ID of the video
     */
    function grantAccess(address user, uint256 videoId) external onlyOwner nonReentrant {
        require(user != address(0), "VideoAccessControl: Invalid user address");
        require(videoId > 0, "VideoAccessControl: Invalid video ID");
        
        // Only increment if this is a new access grant
        if (!hasAccess[videoId][user]) {
            hasAccess[videoId][user] = true;
            totalAccessGrants[videoId]++;
            userPurchaseCount[user]++;
            
            emit AccessGranted(user, videoId, block.timestamp);
        }
    }

    /**
     * @dev Grant access to a video for multiple users (batch operation)
     * @param users Array of user addresses to grant access to
     * @param videoId The ID of the video
     */
    function grantAccessBatch(address[] calldata users, uint256 videoId) external onlyOwner nonReentrant {
        require(users.length > 0, "VideoAccessControl: Empty users array");
        require(videoId > 0, "VideoAccessControl: Invalid video ID");
        
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            require(user != address(0), "VideoAccessControl: Invalid user address");
            
            // Only increment if this is a new access grant
            if (!hasAccess[videoId][user]) {
                hasAccess[videoId][user] = true;
                totalAccessGrants[videoId]++;
                userPurchaseCount[user]++;
            }
        }
        
        emit BatchAccessGranted(users, videoId, block.timestamp);
    }

    /**
     * @dev Revoke access to a video for a specific user
     * @param user The address of the user to revoke access from
     * @param videoId The ID of the video
     */
    function revokeAccess(address user, uint256 videoId) external onlyOwner nonReentrant {
        require(user != address(0), "VideoAccessControl: Invalid user address");
        require(videoId > 0, "VideoAccessControl: Invalid video ID");
        
        if (hasAccess[videoId][user]) {
            hasAccess[videoId][user] = false;
            // Note: We don't decrement counters to maintain historical accuracy
            
            emit AccessRevoked(user, videoId, block.timestamp);
        }
    }

    /**
     * @dev Check if a user has access to a specific video
     * @param user The address of the user
     * @param videoId The ID of the video
     * @return bool indicating whether the user has access
     */
    function checkAccess(address user, uint256 videoId) external view returns (bool) {
        return hasAccess[videoId][user];
    }

    /**
     * @dev Get analytics data for a video
     * @param videoId The ID of the video
     * @return totalGrants The total number of access grants for this video
     */
    function getVideoAnalytics(uint256 videoId) external view returns (uint256 totalGrants) {
        return totalAccessGrants[videoId];
    }

    /**
     * @dev Get analytics data for a user
     * @param user The address of the user
     * @return purchaseCount The total number of videos this user has purchased
     */
    function getUserAnalytics(address user) external view returns (uint256 purchaseCount) {
        return userPurchaseCount[user];
    }

    /**
     * @dev Check access for multiple videos for a user (batch read)
     * @param user The address of the user
     * @param videoIds Array of video IDs to check
     * @return accessStatus Array of booleans indicating access status for each video
     */
    function checkAccessBatch(address user, uint256[] calldata videoIds) 
        external 
        view 
        returns (bool[] memory accessStatus) 
    {
        accessStatus = new bool[](videoIds.length);
        for (uint256 i = 0; i < videoIds.length; i++) {
            accessStatus[i] = hasAccess[videoIds[i]][user];
        }
        return accessStatus;
    }

    /**
     * @dev Emergency function to pause all operations (inherited from Ownable)
     * @notice This can be used if there are critical issues with the contract
     */
    function emergencyWithdraw() external onlyOwner {
        // This contract doesn't hold funds, but this function exists for completeness
        // In case any ETH is accidentally sent to the contract
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner()).transfer(balance);
        }
    }
}