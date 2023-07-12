import 'dotenv/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-ethers'
import '@matterlabs/hardhat-zksync-deploy'
import '@matterlabs/hardhat-zksync-solc'
import '@matterlabs/hardhat-zksync-verify'
import { task, types } from 'hardhat/config'

const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const accounts = process.env.PRIVATE_KEY
  ? [process.env.PRIVATE_KEY]
  : {
      mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
      accountsBalance: '990000000000000000000',
    }

// task('add-fee-tier', 'Add fee tier')
//   .addParam('fee', 'Fee', 100, types.int)
//   .addParam('tickSpacing', 'Tick Spacing', 1, types.int)
//   .setAction(async (taskArgs, hre) => {
//     const { fee, tickSpacing } = taskArgs
//     const { getNamedAccounts, ethers, deployments } = hre
//     const factory = await ethers.getContract('UniswapV3Factory')
//     await factory.enableFeeAmount(fee, tickSpacing)
//     console.log('Enabled fee amount')
//   })

export default {
  zksolc: {
    version: 'latest', // Uses latest available in https://github.com/matter-labs/zksolc-bin/
    settings: {},
  },
  defaultNetwork: 'zksync',
  networks: {
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts,
      chainId: 1,
    },
    zksync: {
      url: 'https://mainnet.era.zksync.io',
      ethNetwork: 'mainnet', // RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
      verifyURL: 'https://explorer.zksync.io/contract_verification', // Verification endpoint
    },
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      'contracts/NonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/MockTimeNonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/NFTDescriptorTest.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/NonfungibleTokenPositionDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/libraries/NFTDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
}
