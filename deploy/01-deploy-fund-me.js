const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log(chainId)
    log(ethUsdPriceFeedAddress)
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1, // hardhat.config.js blockConfirmations: 6
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log(fundMe.address, ethUsdPriceFeedAddress)
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"]

// 其中，hardhat 对象包含了以下属性或方法：
// config：hardhat 的配置信息。
// hardhatArguments：hardhat 命令行参数。
// tasks：hardhat 任务列表。
// userConfig：用户自定义的配置信息。
// run：运行 hardhat 任务。
// artifacts：存储编译后的智能合约信息。
// network：网络信息。
// _extenders：扩展器列表。
// ethers：Ethers.js 库。
// waffle：Waffle 库。
// deployments：部署信息。
// getNamedAccounts：获取命名账户列表。
// getUnnamedAccounts：获取未命名账户列表。
// getChainId：获取当前网络的 chainId。
// companionNetworks：当前网络的配对网络列表。

// 部署顺序
// 1. 按照文件名的字母顺序加载部署脚本，例如，"deploy-1.js" 会比 "deploy-2.js" 先加载。
// 2. 在同一个文件中，按照部署脚本中设置的 priority 字段的值来排序，较小的优先级先执行。如果未设置 priority 字段，则视为优先级为 10。
// module.exports.priority = 1; -> module.exports.priority = 2;
// 3. 在同一个文件中，按照部署脚本的函数名的字母顺序来执行。
// "deploy-1.js" 有 "deployA()" 和 "deployB()",
// 顺序 deployA -> deployB -> deploy-2.js

// npx hardhat node
// 会执行 npx hardhat deploy
// 1 在本地开发环境中运行 Solidity 代码。
// 2 执行测试用例。
// 3 部署智能合约
// 它会在本地启动一个 JSON-RPC 服务器，你可以使用它来与节点交互。


