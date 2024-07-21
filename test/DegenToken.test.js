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
});
