import {
  GetIndexerSubaccountMatchEventParams,
  GetIndexerSubaccountMatchEventsResponse,
  IndexerPaginationParams,
  GetIndexerSubaccountLpEventsResponse,
  GetIndexerSubaccountCollateralEventsParams,
  GetIndexerSubaccountCollateralEventsResponse,
  GetIndexerPaginatedOrdersParams,
  GetIndexerPaginatedOrdersResponse,
  GetIndexerSubaccountSettlementEventsResponse,
  GetIndexerSubaccountLiquidationEventsResponse,
  GetIndexerSubaccountInterestFundingPaymentsParams,
  GetIndexerPaginatedInterestFundingPaymentsResponse,
  GetIndexerPaginatedRewardsParams,
  GetIndexerPaginatedRewardsResponse,
  IndexerServerListSubaccountsParams,
  ListIndexerSubaccountsResponse,
  GetIndexerMultiSubaccountSnapshotsParams,
  GetIndexerMultiSubaccountSnapshotsResponse,
  GetIndexerRewardsParams,
  GetIndexerRewardsResponse,
  GetIndexerTakerRewardsResponse,
  GetIndexerReferralCodeParams,
  GetIndexerReferralCodeResponse,
  GetIndexerFundingRateParams,
  IndexerFundingRate,
  GetIndexerMultiProductFundingRatesParams,
  GetIndexerMultiProductFundingRatesResponse,
  GetIndexerPerpPricesParams,
  IndexerPerpPrices,
  GetIndexerMultiProductPerpPricesParams,
  GetIndexerMultiProductPerpPricesResponse,
  GetIndexerOraclePricesParams,
  GetIndexerOraclePricesResponse,
  GetIndexerCandlesticksParams,
  GetIndexerCandlesticksResponse,
  GetIndexerProductSnapshotsParams,
  GetIndexerProductSnapshotsResponse,
  GetIndexerMultiProductSnapshotsParams,
  GetIndexerMultiProductSnapshotsResponse,
  GetIndexerEventsParams,
  GetIndexerEventsResponse,
  GetIndexerOrdersParams,
  GetIndexerOrdersResponse,
  GetIndexerMatchEventsParams,
  GetIndexerMatchEventsResponse,
  GetIndexerInterestFundingPaymentsParams,
  GetIndexerInterestFundingPaymentsResponse,
  GetIndexerQuotePriceResponse,
  GetIndexerLinkedSignerParams,
  GetIndexerLinkedSignerResponse,
  GetIndexerMarketSnapshotsParams,
  GetIndexerMarketSnapshotsResponse,
  IndexerServerClaimVrtxMerkleProofsParams,
  GetIndexerClaimVrtxMerkleProofsResponse,
  IndexerServerClaimArbMerkleProofsParams,
  GetIndexerBlitzPointsParams,
  GetIndexerBlitzPointsResponse,
  GetIndexerBlastPointsParams,
  GetIndexerBlastPointsResponse,
  GetIndexerBlitzInitialDropConditionsParams,
  GetIndexerBlitzInitialDropConditionsResponse,
  GetIndexerMakerStatisticsParams,
  GetIndexerMakerStatisticsResponse,
  IndexerServerQueryRequestByType,
  IndexerServerQueryResponseByType,
} from '@vertex-protocol/indexer-client';

export interface IndexderClient {
  getQuotePrice(primaryChainId: number): Promise<GetIndexerQuotePriceResponse>;
}

export interface HarmonyContext {
  indexerClient: IndexderClient;
}
