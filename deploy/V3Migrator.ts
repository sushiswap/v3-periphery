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

  if (!process.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS) {
    throw Error(`No NONFUNGIBLE_POSITION_MANAGER_ADDRESS for chain #${chainId}!`)
  }

  const v3Migrator = await hre.artifacts.readArtifact('V3Migrator')

  await deploy('V3Migrator', {
    from: deployer,
    contract: {
      bytecode: v3Migrator.bytecode,
      abi: v3Migrator.abi,
    },
    args: [process.env.FACTORY_ADDRESS, process.env.WNATIVE_ADDRESS, process.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS],
    log: true,
    deterministicDeployment: false,
  })
}

export default func
func.tags = ['V3Migrator']
