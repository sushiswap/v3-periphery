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

  await deploy('NFTDescriptor', {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  })
}

func.tags = ['NFTDescriptor']

export default func
