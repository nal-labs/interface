import { BigNumberish } from 'ethers'
import { ChainId, isL2Chain, TESTNET_CHAIN_IDS } from 'wallet/src/constants/chains'
import { PollingInterval } from 'wallet/src/constants/misc'
import { Chain } from 'wallet/src/data/__generated__/types-and-hooks'
import { logger } from 'wallet/src/features/logger/logger'

const supportedChains = Object.values(ChainId).map((c) => c.toString())

// Some code from the web app uses chainId types as numbers
// This validates them as coerces into SupportedChainId
export function toSupportedChainId(chainId?: BigNumberish): ChainId | null {
  if (!chainId || !supportedChains.includes(chainId.toString())) {
    return null
  }
  return parseInt(chainId.toString(), 10) as ChainId
}

// variant on `toSupportedChain` with a narrower return type
export function parseActiveChains(activeChainsString: string): ChainId[] {
  if (!activeChainsString) return []
  return activeChainsString
    .split(',')
    .map((id) => parseInt(id, 10) as ChainId)
    .filter(Boolean)
}

export function isTestnet(chainId?: ChainId): boolean {
  if (!chainId) return false

  return TESTNET_CHAIN_IDS.includes(chainId)
}

export function fromGraphQLChain(chain: Chain | undefined): ChainId | null {
  switch (chain) {
    case Chain.Ethereum:
      return ChainId.Mainnet
    case Chain.Arbitrum:
      return ChainId.ArbitrumOne
    case Chain.EthereumGoerli:
      return ChainId.Goerli
    case Chain.Optimism:
      return ChainId.Optimism
    case Chain.Polygon:
      return ChainId.Polygon
  }

  return null
}

export function toGraphQLChain(chainId: ChainId): Chain | null {
  switch (chainId) {
    case ChainId.Mainnet:
      return Chain.Ethereum
    case ChainId.ArbitrumOne:
      return Chain.Arbitrum
    case ChainId.Goerli:
      return Chain.EthereumGoerli
    case ChainId.Optimism:
      return Chain.Optimism
    case ChainId.Polygon:
      return Chain.Polygon
  }
  return null
}

export function getPollingIntervalByBlocktime(chainId?: ChainId): PollingInterval {
  return isL2Chain(chainId) ? PollingInterval.LightningMcQueen : PollingInterval.Fast
}

export function fromMoonpayNetwork(moonpayNetwork: string | undefined): ChainId | undefined {
  switch (moonpayNetwork) {
    case Chain.Arbitrum.toLowerCase():
      return ChainId.ArbitrumOne
    case Chain.Optimism.toLowerCase():
      return ChainId.Optimism
    case Chain.Polygon.toLowerCase():
      return ChainId.Polygon
    case undefined:
      return ChainId.Mainnet
    default:
      logger.error('Error parsing Moonpay network', {
        tags: {
          file: 'utils/chainId',
          function: 'fromMoonpayNetwork',
          network: moonpayNetwork,
        },
      })
  }
}