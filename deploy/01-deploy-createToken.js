const { network } = require("hardhat")
const { TokenParameters, localChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// deployed at : 0x86E4a5242BDebF918Ed7d200153545DdCA9df783

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, owner } = await getNamedAccounts()
    const { name, symbol, decimals, totalSupply } = TokenParameters

    console.log(deployer, owner)

    const args = [name, symbol, decimals, totalSupply, owner]
    const createToken = await deploy("CreateToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("CreateToken contract deployed succesfully!!")

    if (!localChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(createToken.address, args)
    }

    log("********************************************************************************")
}

module.exports.tags = ["createToken"]
