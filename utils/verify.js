const { run } = require("hardhat")

// https://goerli.etherscan.io/address/0xFb28b5d4F641740891137ea3D373180A1FBD4463#code
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    // etherscan 验证合约
    await run("verify:verify", {
      address: contractAddress, // 合约地址
      constructorArguments: args, // 合约构造函数的入参
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
      console.log(e)
    }
  }
}

module.exports = { verify }
