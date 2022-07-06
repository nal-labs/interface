import { default as React, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { useAppSelector } from 'src/app/hooks'
import { useExploreStackNavigation } from 'src/app/navigation/types'
import { AddressDisplay } from 'src/components/AddressDisplay'
import { Button } from 'src/components/buttons/Button'
import { Box } from 'src/components/layout'
import { BaseCard } from 'src/components/layout/BaseCard'
import { selectWatchedAddressSet } from 'src/features/favorites/selectors'
import { Screens } from 'src/screens/Screens'

/** Renders the favorite tokens card on the Explore page */
export function WatchedWalletsCard({ onSearchWallets }: { onSearchWallets: () => void }) {
  const { t } = useTranslation()
  const navigation = useExploreStackNavigation()
  const watchedWalletsSet = useAppSelector(selectWatchedAddressSet)
  const watchedWalletsList = useMemo(() => Array.from(watchedWalletsSet), [watchedWalletsSet])

  const renderItem = useCallback(
    ({ item: address }: ListRenderItemInfo<string>) => {
      return (
        <Button
          onPress={() => {
            navigation.navigate(Screens.User, { address })
          }}>
          <Box mx="sm">
            <AddressDisplay address={address} direction="column" variant="smallLabel" />
          </Box>
        </Button>
      )
    },
    [navigation]
  )

  const hasWatchedWallets = watchedWalletsList.length > 0

  return (
    <BaseCard.Container>
      <BaseCard.Header
        title={t("Wallets you're watching ({{watchedWalletsCount}})", {
          watchedWalletsCount: watchedWalletsList.length,
        })}
        onPress={
          hasWatchedWallets
            ? () => {
                navigation.navigate(Screens.WatchedWallets)
              }
            : undefined
        }
      />
      {hasWatchedWallets ? (
        <Box mx="xxs" my="md">
          <FlatList
            horizontal
            data={watchedWalletsList}
            keyExtractor={(address) => address}
            renderItem={renderItem}
          />
        </Box>
      ) : (
        <BaseCard.EmptyState
          buttonLabel={t('Search wallets')}
          description={t("When you watch wallets, they'll appear here.")}
          onPress={onSearchWallets}
        />
      )}
    </BaseCard.Container>
  )
}
