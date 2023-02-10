const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("NFT", function () {

  async function deployFixture() {
    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();

    await nft.deployed();
    return { nft, };
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { nft } = await loadFixture(deployFixture);
    });



  });


});
