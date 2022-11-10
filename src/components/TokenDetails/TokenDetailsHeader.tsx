import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { TokenLogo } from 'src/components/CurrencyLogo/TokenLogo'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import WarningIcon from 'src/components/tokens/WarningIcon'
import { SafetyLevel, TokenDetailsScreenQuery } from 'src/data/__generated__/types-and-hooks'
import { flex } from 'src/styles/flex'
import { theme } from 'src/styles/theme'
import { fromGraphQLChain } from 'src/utils/chainId'

export interface TokenDetailsHeaderProps {
  data?: TokenDetailsScreenQuery
  onPressWarningIcon: () => void
}

export function TokenDetailsHeader({ data, onPressWarningIcon }: TokenDetailsHeaderProps) {
  const { t } = useTranslation()

  const token = data?.tokens?.[0]
  const tokenProject = token?.project

  return (
    <Flex mx="md">
      <TokenLogo
        chainId={fromGraphQLChain(token?.chain) ?? undefined}
        symbol={token?.symbol ?? undefined}
        url={tokenProject?.logoUrl ?? undefined}
      />
      <Flex row alignItems="center" gap="xs">
        <Text color="textPrimary" numberOfLines={1} style={flex.shrink} variant="subheadLarge">
          {token?.name ?? t('Unknown token')}
        </Text>
        {/* Suppress warning icon on low warning level */}
        {(tokenProject?.safetyLevel === SafetyLevel.StrongWarning ||
          tokenProject?.safetyLevel === SafetyLevel.Blocked) && (
          <TouchableArea onPress={onPressWarningIcon}>
            <WarningIcon
              height={theme.iconSizes.md}
              safetyLevel={tokenProject?.safetyLevel}
              strokeColorOverride="textSecondary"
              width={theme.imageSizes.sm}
            />
          </TouchableArea>
        )}
      </Flex>
    </Flex>
  )
}
