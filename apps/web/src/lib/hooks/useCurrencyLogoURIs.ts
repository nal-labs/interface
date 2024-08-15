import EthereumLogo from 'assets/images/ethereum-logo.png'
import AvaxLogo from 'assets/svg/avax_logo.svg'
import BnbLogo from 'assets/svg/bnb-logo.svg'
import CeloLogo from 'assets/svg/celo_logo.svg'
import MaticLogo from 'assets/svg/matic-token-icon.svg'
import USDCLogo from 'assets/images/usdc-logo.png'
import USDTLogo from 'assets/images/usdt-logo.png'
import WETHLogo from 'assets/images/weth-logo.png'
import { getChain, isSupportedChainId } from 'constants/chains'
import { PORTAL_ETH_CELO, isCelo, nativeOnChain,
  USDC_NAL,
  USDC_NAL_SEPOLIA,
  USDT_NAL,
  USDT_NAL_SEPOLIA
 } from 'constants/tokens'
import { add } from 'date-fns'
import { InterfaceChainId, UniverseChainId } from 'uniswap/src/types/chains'
import { isSameAddress } from 'utilities/src/addresses'

export function getNativeLogoURI(chainId: InterfaceChainId = UniverseChainId.Mainnet): string {
  switch (chainId) {
    case UniverseChainId.Polygon:
    case UniverseChainId.PolygonMumbai:
      return MaticLogo
    case UniverseChainId.Bnb:
      return BnbLogo
    case UniverseChainId.Celo:
    case UniverseChainId.CeloAlfajores:
      return CeloLogo
    case UniverseChainId.Avalanche:
      return AvaxLogo
    default:
      return EthereumLogo
  }
}

export function getTokenLogoURI(address: string, chainId: InterfaceChainId = UniverseChainId.Mainnet): string | void {
  const networkName = isSupportedChainId(chainId) ? getChain({ chainId }).assetRepoNetworkName : undefined

  if (isCelo(chainId) && isSameAddress(address, nativeOnChain(chainId).wrapped.address)) {
    return CeloLogo
  }
  if (isCelo(chainId) && isSameAddress(address, PORTAL_ETH_CELO.address)) {
    return EthereumLogo
  }

  if (UniverseChainId.Nal == chainId || UniverseChainId.NalSepolia == chainId) {
    if (isSameAddress(address, USDC_NAL.address) || isSameAddress(address, USDC_NAL_SEPOLIA.address))
      return USDCLogo
    if (isSameAddress(address, USDT_NAL.address) || isSameAddress(address, USDT_NAL_SEPOLIA.address))
      return USDTLogo
    if (isSameAddress(address, "0x4200000000000000000000000000000000000006"))
      return WETHLogo
  }
  
  if (networkName) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }
}
