const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DegenToken", function () {
  let DegenToken, degenToken, owner, addr1, addr2;

  beforeEach(async function () {
    DegenToken = await ethers.getContractFactory("DegenToken");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    degenToken = await DegenToken.deploy();
    await degenToken.deployed();
  });

  it("Should have the correct name and symbol", async function () {
    expect(await degenToken.name()).to.equal("Degen");
    expect(await degenToken.symbol()).to.equal("DGN");
  });

  it("Should mint tokens correctly", async function () {
    await degenToken.mint(addr1.address, 1000);
    expect(await degenToken.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should transfer tokens correctly", async function () {
    await degenToken.mint(addr1.address, 1000);
    await degenToken.connect(addr1).transfer(addr2.address, 500);
    expect(await degenToken.balanceOf(addr1.address)).to.equal(500);
    expect(await degenToken.balanceOf(addr2.address)).to.equal(500);
  });

  it("Should burn tokens correctly", async function () {
    await degenToken.mint(addr1.address, 1000);
    await degenToken.connect(addr1).burn(500);
    expect(await degenToken.balanceOf(addr1.address)).to.equal(500);
  });

  it("Should buy clothing items correctly", async function () {
    await degenToken.mint(addr1.address, 1000);
    await degenToken.connect(addr1).buyClothingItem(0, 1); // Buying 1 Virtual Hat
    expect(await degenToken.balanceOf(addr1.address)).to.equal(900); // 100 tokens deducted
    expect(await degenToken.getUserClothingBalance(addr1.address, 0)).to.equal(
      1
    );
  });

  it("Should return clothing item details correctly", async function () {
    const clothingItem = await degenToken.getClothingItem(0);
    expect(clothingItem[0]).to.equal("Virtual Hat");
    expect(clothingItem[1]).to.equal(100);
    expect(clothingItem[2]).to.be.true;
  });

  it("Should set clothing item availability correctly", async function () {
    await degenToken.setClothingItemAvailability(0, false);
    const clothingItem = await degenToken.getClothingItem(0);
    expect(clothingItem[2]).to.be.false;
  });

  it("Should add a new clothing item correctly", async function () {
    await degenToken.addClothingItem("Virtual Shoes", 250);
    const clothingItem = await degenToken.getClothingItem(3);
    expect(clothingItem[0]).to.equal("Virtual Shoes");
    expect(clothingItem[1]).to.equal(250);
    expect(clothingItem[2]).to.be.true;
  });
});
