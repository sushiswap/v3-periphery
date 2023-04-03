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

  if (!process.env.NATIVE_CURRENCY_LABEL) {
    throw Error(`No NATIVE_CURRENCY_LABEL for chain #${chainId}!`)
  }

  console.log('Deploying NonfungibleTokenPositionDescriptor...', {
    args: [process.env.WNATIVE_ADDRESS, process.env.NATIVE_CURRENCY_LABEL],
  })

  const NFTDescriptor = await deployments.get('NFTDescriptor')

  await deploy('NonfungibleTokenPositionDescriptor', {
    from: deployer,
    args: [process.env.WNATIVE_ADDRESS, process.env.NATIVE_CURRENCY_LABEL],
    log: true,
    deterministicDeployment: false,
    libraries: {
      NFTDescriptor: NFTDescriptor.address,
    },
  })
}

func.tags = ['NonfungibleTokenPositionDescriptor']

func.dependencies = ['NFTDescriptor']

export default func
