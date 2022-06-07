import { default as React, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ListRenderItemInfo } from 'react-native'
import { useExploreStackNavigation } from 'src/app/navigation/types'
import { ChainId } from 'src/constants/chains'
import { Asset } from 'src/features/dataApi/zerion/types'
import {
  BaseTokenSectionProps,
  GenericTokenSection,
} from 'src/features/explore/GenericTokenSection'
import { useFavoriteTokenInfo } from 'src/features/explore/hooks'
import { TokenItemBox } from 'src/features/explore/TokenItem'
import { Screens } from 'src/screens/Screens'
import { buildCurrencyId } from 'src/utils/currencyId'

/** Renders the favorite tokens section on the Explore page */
export function FavoriteTokensSection(props: BaseTokenSectionProps) {
  const { t } = useTranslation()
  const navigation = useExploreStackNavigation()

  const { currentData: favorites, isLoading } = useFavoriteTokenInfo()

  const renderItem = useCallback(
    ({ item: token, index }: ListRenderItemInfo<Asset>) => {
      return (
        <TokenItemBox
          index={index}
          token={token}
          onPress={() => {
            navigation.navigate(Screens.TokenDetails, {
              currencyId: buildCurrencyId(ChainId.Mainnet, token.asset.asset_code),
            })
          }}
        />
      )
    },
    [navigation]
  )

  return favorites ? (
    <GenericTokenSection
      {...props}
      horizontal
      assets={favorites?.info}
      id="explore-favorites-header"
      loading={isLoading}
      renderItem={renderItem}
      title={t('Favorites')}
    />
  ) : null
}
