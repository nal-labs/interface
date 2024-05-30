import { SafetyLevel } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { ChainId } from 'uniswap/src/types/chains'
import { NativeCurrency } from 'wallet/src/features/tokens/NativeCurrency'
import { faker } from 'wallet/src/test/shared'
import { createFixture } from 'wallet/src/test/utils'
import { currencyId } from 'wallet/src/utils/currencyId'

export const MAINNET_CURRENCY = NativeCurrency.onChain(ChainId.Mainnet)
export const BASE_CURRENCY = NativeCurrency.onChain(ChainId.Base)
export const ARBITRUM_CURRENCY = NativeCurrency.onChain(ChainId.ArbitrumOne)
export const OPTIMISM_CURRENCY = NativeCurrency.onChain(ChainId.Optimism)
export const POLYGON_CURRENCY = NativeCurrency.onChain(ChainId.Polygon)

type CurrencyInfoOptions = {
  nativeCurrency: NativeCurrency
}

export const currencyInfo = createFixture<CurrencyInfo, CurrencyInfoOptions>({
  nativeCurrency: MAINNET_CURRENCY,
})(({ nativeCurrency }) => ({
  currencyId: currencyId(nativeCurrency),
  currency: nativeCurrency,
  logoUrl: faker.image.imageUrl(),
  safetyLevel: SafetyLevel.Verified,
}))

export const ethCurrencyInfo = createFixture<CurrencyInfo>()(() =>
  currencyInfo({
    nativeCurrency: MAINNET_CURRENCY,
    logoUrl: 'https://token-icons.s3.amazonaws.com/eth.png',
  })
)

export const uniCurrencyInfo = createFixture<CurrencyInfo>()(() =>
  currencyInfo({
    nativeCurrency: MAINNET_CURRENCY,
    logoUrl:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  })
)

export const daiCurrencyInfo = createFixture<CurrencyInfo>()(() =>
  currencyInfo({
    nativeCurrency: MAINNET_CURRENCY,
    logoUrl:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  })
)

export const arbitrumDaiCurrencyInfo = createFixture<CurrencyInfo>()(() =>
  currencyInfo({
    nativeCurrency: ARBITRUM_CURRENCY,
    logoUrl:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  })
)

export const usdcCurrencyInfo = createFixture<CurrencyInfo>()(() =>
  currencyInfo({
    nativeCurrency: BASE_CURRENCY,
    logoUrl: null,
  })
)

export const ETH_CURRENCY_INFO = ethCurrencyInfo()
export const UNI_CURRENCY_INFO = uniCurrencyInfo()
export const DAI_CURRENCY_INFO = daiCurrencyInfo()
export const ARBITRUM_DAI_CURRENCY_INFO = arbitrumDaiCurrencyInfo()
export const USDC_CURRENCY_INFO = usdcCurrencyInfo()
