import { DiscList } from '@vertex-protocol/web-ui';
import { DefinitionTooltipConfig } from 'client/modules/tooltips/DefinitionTooltip/types';
import { PRIMARY_QUOTE_SYMBOL } from 'common/productMetadata/primaryQuoteSymbol';
import { VRTX_TOKEN_INFO } from 'common/productMetadata/vertexTokenInfo';

const lpMarketsTooltips = {
  lpMarkets24hVolume: {
    title: `24h Volume`,
    content: `The past 24h volume for the trading pair.`,
  },
};

const lbaPositionTooltips = {
  lbaPositionSuppliedToLba: {
    title: `Supplied to LBA`,
    content: `Your contribution of ${PRIMARY_QUOTE_SYMBOL} and ${VRTX_TOKEN_INFO.symbol} to the LBA.`,
  },
  lbaPositionLiquidityStatus: {
    title: `Locked / UnLocked Liq.`,
    content: `LBA liquidity unlocks according to the vesting schedule. Unlocked liquidity can be withdrawn.`,
  },
};

const perpPositionsTooltips = {
  perpPositionsFundingPayments: {
    title: `Funding`,
    content: `The total funding payments you have received (+) or paid (-). Payments are made hourly in ${PRIMARY_QUOTE_SYMBOL}. The funding rate for payments is calculated based on the difference between the the market's TWAP orderbook price and the spot index price.`,
  },
  perpPositionsMargin: {
    title: `Position Margin`,
    content: `The initial margin required to maintain this position.`,
  },
  perpPositionsEstimatedLiqPrice: {
    title: `Est. Liq. Price`,
    content: (
      <>
        <p>
          The estimated price at which a position would make a user eligible for
          liquidation.
        </p>
        <p className="flex-inline">
          <span className="text-text-primary">Please note</span> - this only
          works for a move in a single underlying position. For users with
          multiple positions, risk should be evaluated on a portfolio basis
          using alternative metrics.
        </p>
      </>
    ),
  },
  perpPositionsTpSl: {
    title: `Take Profit & Stop Loss`,
    content: (
      <DiscList.Container>
        <DiscList.Item>
          TP/SL are <span className="text-text-primary">reduce-only</span>,
          which means that they can only close an existing position.
        </DiscList.Item>
        <DiscList.Item>
          TP/SL are{' '}
          <span className="text-text-primary">
            fill-or-kill stop market orders
          </span>{' '}
          where execution is not guaranteed. If the order cannot be filled
          within slippage limits, then the order will not execute.
        </DiscList.Item>
        <DiscList.Item>1CT must be enabled to use TP/SL.</DiscList.Item>
      </DiscList.Container>
    ),
  },
};

const openEngineOrdersTooltips = {
  openEngineOrdersLimitPrice: {
    title: 'Price',
    content: `The price at which the limit order will be executed.`,
  },
};

const openTriggerOrdersTooltips = {
  triggerOrderLimitPrice: {
    title: 'Limit Price',
    content: (
      <>
        <p>
          This is the limit execution price for the order, calculated as trigger
          price ± slippage tolerance.
        </p>
        <p>You can update your slippage tolerance in the settings.</p>
      </>
    ),
  },
};

const marginManagerPerpPositionsTooltips = {
  marginManagerPerpPositionsUnsettledQuoteInfo: {
    title: `Unsettled ${PRIMARY_QUOTE_SYMBOL}`,
    content: (
      <>
        <p>
          Unsettled {PRIMARY_QUOTE_SYMBOL} is the portion of open Perp PnL yet
          to be settled into the underlying {PRIMARY_QUOTE_SYMBOL} balance. Perp
          positions are periodically “settled” between traders, transferring{' '}
          {PRIMARY_QUOTE_SYMBOL} between winning and losing positions.
        </p>
        <DiscList.Container>
          <DiscList.Item>
            <span className="text-text-primary">Positive</span> = once settled,
            this amount of {PRIMARY_QUOTE_SYMBOL} will be added to your balance.
          </DiscList.Item>
          <DiscList.Item>
            <span className="text-text-primary">Negative</span> = once settled,
            this amount of {PRIMARY_QUOTE_SYMBOL} will be subtracted from your
            balance.
          </DiscList.Item>
        </DiscList.Container>
      </>
    ),
  },
};

const fundingRateMarketsTooltips = {
  fundingRateMarketsPredictedHourlyFunding: {
    title: `Predicted Funding`,
    content:
      'The estimated hourly funding rate based on the current spot index price and TWAP of orderbook (mark price). The funding rate is realized when the payment is made, which is every hour (see countdown).',
  },
};

const perpMarketsTooltips = {
  fundingRatePerpsPredictedHourlyFunding: {
    title: `Predicted Funding`,
    content:
      'The estimated funding based on the current spot index price and mark price. Funding payments are made every hour.',
  },
};

const interestPaymentsTooltips = {
  interestPayment: {
    title: `Interest Payment`,
    content: (
      <div className="flex flex-col gap-y-2">
        <div>Interest payments are made on average every 15 minutes.</div>
        <DiscList.Container>
          <DiscList.Item>
            Deposit/Positive balance = you are paid interest
          </DiscList.Item>
          <DiscList.Item>
            Borrow/Negative balance = you pay interest
          </DiscList.Item>
        </DiscList.Container>
        <div>
          The payment is calculated as: (interest rate at time of payment) x
          (value of the balance). The value is determined using the oracle
          price.
        </div>
        <div>
          Payments are made in the underlying asset. If you do not have it, the
          protocol will automatically borrow it.
        </div>
      </div>
    ),
  },
};

const realizedPnlEventsTooltips = {
  realizedPnlPositionSize: {
    title: `Size`,
    content: `The amount of your order that was filled at this price. An order can fill across different prices until fully filled or cancelled.`,
  },
};

const historicalTradesTooltips = {
  historicalTradesSequencerFee: {
    title: 'Sequencer Fee',
    content: 'Fee collected per trade for sequencer gas costs',
  },
};

const historicalWithdrawalsTooltips = {
  historicalWithdrawalsStatus: {
    title: `Status`,
    content: `We minimize user fees by sending withdrawal transactions on-chain when gas fees are low. All actions still happen instantaneously, but withdrawals can take longer during high gas periods. If your withdrawal appears here, it was successfully placed and will settle on-chain once the target gas threshold is reached.`,
  },
};

const historicalLpEventsTooltips = {
  historicalLpChangeInBalances: {
    title: `Change in Balances`,
    content: `The change in asset balances for this transaction. The transaction fee is included in the amounts shown.`,
  },
};

const historicalSettlementsTooltips = {
  historicalSettlement: {
    title: `Settlement`,
    content: (
      <>
        <p>
          Perp PnL is periodically settled between traders, transferring{' '}
          {PRIMARY_QUOTE_SYMBOL} between winning and losing positions.
          Settlements include any gains or losses from funding payments.
        </p>
        <DiscList.Container>
          <DiscList.Item>
            <span className="text-text-primary">(+)</span> = the position had
            positive PnL and you were paid {PRIMARY_QUOTE_SYMBOL}
          </DiscList.Item>
          <DiscList.Item>
            <span className="text-text-primary">(-)</span> = the position had
            negative PnL and you paid {PRIMARY_QUOTE_SYMBOL}
          </DiscList.Item>
        </DiscList.Container>
      </>
    ),
  },
};

const historicalLiquidationTooltips = {
  historicalLiquidationAffectedPositions: {
    title: `Liquidation`,
    content: `The size and value of the position(s) affected by the liquidation. Values are calculated using the oracle price.`,
  },
  historicalLiquidationOraclePrice: {
    title: 'Oracle Price',
    content: `The price of the position at the time of liquidation. For LPs, the oracle price of the underlying asset is shown. The liquidation price occurs at a discount to the oracle price. For the exact mechanics and calculation, please consult the documentation.`,
  },
  historicalLiquidationPositionChanges: {
    title: `Position Changes`,
    content: `The associated changes in position size from the liquidation. Affected LP positions from a liquidation are decomposed into the underlying asset.`,
  },
  historicalLiquidationUsdcChanges: {
    title: `Liquidation ${PRIMARY_QUOTE_SYMBOL} Transfer`,
    content: `To liquidate a position, there must be a ${PRIMARY_QUOTE_SYMBOL} transfer between you and the liquidator. This is the net change in ${PRIMARY_QUOTE_SYMBOL} for your account as a result of the liquidation.`,
  },
  historicalLiquidationType: {
    title: `Type of Liquidation`,
    content: (
      <>
        <p>
          Liquidation events happen one by one, with the riskiest positions
          being liquidated first.
        </p>
        <div>
          Types:
          <DiscList.Container>
            <DiscList.Item>A perp position is liquidated</DiscList.Item>
            <DiscList.Item>A balance is liquidated</DiscList.Item>
            <DiscList.Item>An LP Position is liquidated</DiscList.Item>
            <DiscList.Item>Some combination of the above</DiscList.Item>
          </DiscList.Container>
        </div>
        <p>
          The latter only happens if you have a perp position and a balance/LP{' '}
          position of the perp’s underlying asset.
        </p>
      </>
    ),
  },
};

export const tableTooltips = {
  ...lpMarketsTooltips,
  ...perpPositionsTooltips,
  ...openEngineOrdersTooltips,
  ...openTriggerOrdersTooltips,
  ...marginManagerPerpPositionsTooltips,
  ...interestPaymentsTooltips,
  ...realizedPnlEventsTooltips,
  ...historicalTradesTooltips,
  ...historicalLpEventsTooltips,
  ...historicalLiquidationTooltips,
  ...historicalSettlementsTooltips,
  ...historicalWithdrawalsTooltips,
  ...fundingRateMarketsTooltips,
  ...perpMarketsTooltips,
  ...lbaPositionTooltips,
} as const satisfies Record<string, DefinitionTooltipConfig>;
