import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function ({
  ethers,
  getNamedAccounts,
  deployments,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  if (!process.env.WNATIVE_ADDRESS) {
    throw Error(`No WNATIVE_ADDRESS for chain #${chainId}!`)
  }

  if (!process.env.FACTORY_ADDRESS) {
    throw Error(`No FACTORY_ADDRESS for chain #${chainId}!`)
  }

  if (!deployments.get('NonfungibleTokenPositionDescriptor')) {
    throw Error(`No NonfungibleTokenPositionDescriptor for chain #${chainId}!`)
  }

  const NonfungibleTokenPositionDescriptor = await deployments.get('NonfungibleTokenPositionDescriptor')

  await deploy('NonfungiblePositionManager', {
    from: deployer,
    args: [process.env.FACTORY_ADDRESS, process.env.WNATIVE_ADDRESS, NonfungibleTokenPositionDescriptor.address],
    log: true,
    deterministicDeployment: false,
  })
}

func.tags = ['NonfungiblePositionManager']

func.dependencies = ['NonfungibleTokenPositionDescriptor']

export default func
