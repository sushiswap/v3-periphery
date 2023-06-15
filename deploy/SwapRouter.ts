import { ethers } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnviorment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()

  if (!process.env.WNATIVE_ADDRESS) {
    throw Error(`No WNATIVE_ADDRESS for chain #${chainId}!`)
  }

  if (!process.env.FACTORY_ADDRESS) {
    throw Error(`No FACTORY_ADDRESS for chain #${chainId}!`)
  }

  const swapRouterArtifact = await hre.artifacts.readArtifact('SwapRouter')

  await deploy('SwapRouter', {
    from: deployer,
    contract: {
      bytecode: swapRouterArtifact.bytecode,
      abi: swapRouterArtifact.abi,
      },
      args: [process.env.FACTORY_ADDRESS, process.env.WNATIVE_ADDRESS],
      log: true,
      deterministicDeployment: false,
  })
}

export default func
func.tags = ['SwapRouter']