const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { TokenParameters, localChains } = require("../../helper-hardhat-config")

const AMOUNT = 500

!localChains.includes(network.name)
    ? describe.skip
    : describe("CreteToken Unit Test", async function () {
          let createToken, owner, accounts, user1, user2
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              accounts = await ethers.getSigners()
              owner = accounts[1]
              user1 = accounts[2]
              await deployments.fixture(["createToken"])

              createToken = await ethers.getContract("CreateToken", deployer)
          })

          describe("constructor", async function () {
              it("Initializes name correctly", async function () {
                  const name = await createToken.getName()
                  assert.equal(name.toString(), TokenParameters.name)
              })

              it("Initializes symbol correctly", async function () {
                  const symbol = await createToken.getSymbol()
                  assert.equal(symbol.toString(), TokenParameters.symbol)
              })

              it("Initializes decimals correctly", async function () {
                  const decimals = await createToken.getDecimals()
                  assert.equal(decimals.toString(), TokenParameters.decimals)
              })

              it("Initializes Test token supply correctly", async function () {
                  const totalSupply = await createToken.totalSupply()
                  assert.equal(totalSupply.toString(), TokenParameters.totalSupply)
              })

              it("Check balance of owner", async function () {
                  const balanceOfOwner = await createToken.balanceOf(owner.address)
                  assert.equal(TokenParameters.totalSupply, balanceOfOwner.toString())
              })
          })

          describe("transfer", function () {
              it("Check balance of owner", async function () {
                  const balanceOfOwner = await createToken.balanceOf(owner.address)
                  assert.equal(TokenParameters.totalSupply, balanceOfOwner.toString())
              })

              it("Check balance of user1", async function () {
                  const balanceOfUser1 = await createToken.balanceOf(user1.address)
                  assert.equal("0", balanceOfUser1.toString())
              })

              it("Owner transfers 500 Test token to user1, check balances, it emits event", async function () {
                  const initialBalanceOfOwner = await createToken.balanceOf(owner.address)
                  const initialBalanceOfUser1 = await createToken.balanceOf(user1.address)

                  const ownerConnectedContract = await createToken.connect(owner)
                  const tx = await ownerConnectedContract.transfer(user1.address, AMOUNT)

                  const finalBalanceOfOwner = await createToken.balanceOf(owner.address)
                  const finalBalanceOfUser1 = await createToken.balanceOf(user1.address)

                  assert(
                      finalBalanceOfOwner.toString(),
                      initialBalanceOfOwner.sub(AMOUNT.toString())
                  )
                  assert(
                      finalBalanceOfUser1.toString(),
                      initialBalanceOfUser1.add(AMOUNT.toString())
                  )

                  await expect(tx).to.emit(createToken, "Transfer")
              })
          })

          describe("transferFrom", function () {
              it("Approve user1 to spend given amount Test token on behalf of the  owner", async function () {
                  const initialBalanceOfOwner = await createToken.balanceOf(owner.address)
                  const initialBalanceOfUser1 = await createToken.balanceOf(user1.address)

                  createToken = createToken.connect(owner)
                  const approvalTx = await createToken.approve(user1.address, AMOUNT)

                  await expect(approvalTx).to.emit(createToken, "Approval")

                  const allowance = await createToken.allowance(owner.address, user1.address)

                  assert.equal(allowance.toString(), AMOUNT.toString())

                  createTokenUser1Connected = createToken.connect(user1)

                  // user1 has the aproval to pull token out of owner's account
                  const transferFromTx = await createTokenUser1Connected.transferFrom(
                      owner.address,
                      user1.address,
                      AMOUNT
                  )
                  await expect(transferFromTx).to.emit(createToken, "Transfer")

                  const finalBalanceOfOwner = await createToken.balanceOf(owner.address)
                  const finalBalanceOfUser1 = await createToken.balanceOf(user1.address)

                  assert(
                      finalBalanceOfOwner.toString(),
                      initialBalanceOfOwner.sub(AMOUNT.toString())
                  )
                  assert(
                      finalBalanceOfUser1.toString(),
                      initialBalanceOfUser1.add(AMOUNT.toString())
                  )
              })
          })
      })
