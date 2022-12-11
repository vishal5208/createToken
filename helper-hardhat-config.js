const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
}

const localChains = ["hardhat", "localhost"]

const TokenParameters = {
    name: "Test",
    symbol: "T",
    decimals: "18",
    totalSupply: "30000000",
}

module.exports = {
    networkConfig,
    localChains,
    TokenParameters,
}
