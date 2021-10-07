import { createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Token } from '@uniswap/sdk-core'
import * as Comlink from 'comlink'
import qs from 'qs'
import { AppState } from 'state'
import { RouterType } from 'worker/smartOrderRouter/router.worker'
import SmartOrderRouterWorker from 'worker-loader!worker/smartOrderRouter/router.worker'

import { GetQuoteResult } from './types'

let comlinkWorker: Comlink.Remote<RouterType> | null = null

function getWorker() {
  return comlinkWorker ?? (comlinkWorker = Comlink.wrap<RouterType>(new SmartOrderRouterWorker()))
}

async function getClientSideQuote({
  tokenIn,
  tokenOut,
  amount,
  type,
}: {
  // objects must be serializable in redux store
  tokenIn: Pick<Token, 'address' | 'chainId' | 'symbol' | 'decimals'>
  tokenOut: Pick<Token, 'address' | 'chainId' | 'symbol' | 'decimals'>
  amount: string
  type: 'exactIn' | 'exactOut'
}) {
  // TODO(judo): update worker when token list changes?
  return getWorker().getQuote({
    type,
    chainId: tokenIn.chainId,
    tokenIn: { address: tokenIn.address, chainId: tokenIn.chainId, decimals: tokenIn.decimals },
    tokenOut: { address: tokenOut.address, chainId: tokenOut.chainId, decimals: tokenOut.decimals },
    amount,
  })
}

export const routingApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.uniswap.org/v1/',
  }),
  endpoints: (build) => ({
    getQuote: build.query<
      GetQuoteResult,
      {
        // objects must be serializable in redux store
        tokenIn: Pick<Token, 'address' | 'chainId' | 'symbol' | 'decimals'>
        tokenOut: Pick<Token, 'address' | 'chainId' | 'symbol' | 'decimals'>
        amount: string
        type: 'exactIn' | 'exactOut'
      }
    >({
      async queryFn(args, { getState }, _, fetch) {
        const { tokenIn, tokenOut, amount, type } = args
        const useClientSideRouter: boolean = (getState() as AppState).user.userClientSideRouter

        let result
        if (useClientSideRouter) {
          result = await getClientSideQuote(args)
        } else {
          result = await fetch(
            `quote?${qs.stringify({
              tokenInAddress: tokenIn.address,
              tokenInChainId: tokenIn.chainId,
              tokenOutAddress: tokenOut.address,
              tokenOutChainId: tokenOut.chainId,
              amount,
              type,
            })}`
          )
        }

        if (result.error) {
          throw result.error
        }

        return { data: result.data as GetQuoteResult }
      },
    }),
  }),
})

export const { useGetQuoteQuery } = routingApi
