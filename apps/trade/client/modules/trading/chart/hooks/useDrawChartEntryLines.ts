import { ProductEngineType } from '@vertex-protocol/contracts';
import { useAllMarketsStaticData } from 'client/hooks/markets/useAllMarketsStaticData';
import {
  PerpPositionItem,
  usePerpPositions,
} from 'client/hooks/subaccount/usePerpPositions';
import { useDialog } from 'client/modules/app/dialogs/hooks/useDialog';
import { TradingViewSymbolInfo } from 'client/modules/trading/chart/config/datafeedConfig';
import { getMarketPriceFormatSpecifier } from 'client/utils/formatNumber/getMarketPriceFormatSpecifier';
import { COLORS } from 'common/theme/colors';
import { FONTS } from 'common/theme/fonts';
import {
  IChartWidgetApi,
  IChartingLibraryWidget,
  IPositionLineAdapter,
} from 'public/charting_library';
import { useCallback, useEffect, useRef } from 'react';
import { isChartSyncedToSymbolInfo } from '../utils/isChartSyncedToSymbolInfo';

interface Params {
  tvWidget?: IChartingLibraryWidget;
  selectedSymbolInfo?: TradingViewSymbolInfo;
}

// Mapping from product ID to the average entry line for that product
type EntryLineByProductId = Map<number, IPositionLineAdapter>;

export function useDrawChartEntryLines({
  tvWidget,
  selectedSymbolInfo,
}: Params) {
  const existingLinesByProductId = useRef<EntryLineByProductId>(new Map());
  const { data: perpPositionsData } = usePerpPositions();
  const { data: marketStaticData } = useAllMarketsStaticData();
  const { show } = useDialog();

  // When TV Widget reloads, clear any cached lines as they are all removed
  useEffect(() => {
    existingLinesByProductId.current.clear();
  }, [tvWidget]);

  /**
   * Cases:
   * - Not spot: no action needed
   * - No position: clear line if exists
   * - No existing line: create
   * - Existing line: update
   */
  return useCallback(() => {
    if (
      !selectedSymbolInfo ||
      selectedSymbolInfo.productType === ProductEngineType.SPOT
    ) {
      return;
    }

    const selectedProductId = selectedSymbolInfo.productId;
    const selectedPosition = perpPositionsData?.find(
      (position) => position.productId === selectedProductId,
    );
    const marketData = marketStaticData?.all[selectedProductId];

    if (!tvWidget || !selectedProductId || !selectedPosition || !marketData) {
      return;
    }

    const activeChart = tvWidget.activeChart();
    const activeChartSymbol = activeChart.symbol();

    if (!isChartSyncedToSymbolInfo(activeChartSymbol, selectedSymbolInfo)) {
      return;
    }

    const existingLine =
      existingLinesByProductId.current.get(selectedProductId);
    const noPosition =
      selectedPosition.amount.isZero() ||
      selectedPosition.price.averageEntryPrice.isZero();

    // If there is no position, remove the line if it exists
    if (noPosition) {
      if (existingLine) {
        console.debug(
          '[useDrawChartEntryLines]: Removing position line:',
          selectedPosition.productId,
        );
        existingLine.remove();
        existingLinesByProductId.current.delete(selectedProductId);
      }
      return;
    }

    // No further action needed if there's an existing line with the same price, need to do a roughly equals check
    // here given different levels of precision
    if (existingLine) {
      const priceDiff = selectedPosition.price.averageEntryPrice
        .minus(existingLine.getPrice())
        .abs();
      // No-op if the price difference is less than 0.001% of the average entry price, which is guaranteed to be non-zero given the above check
      if (priceDiff.div(selectedPosition.price.averageEntryPrice).lt(0.00001)) {
        return;
      }
    }

    console.debug(
      '[useDrawChartEntryLines]: Upserting position line:',
      selectedPosition.productId,
      selectedPosition.amount.toString(),
      selectedPosition.price.averageEntryPrice.toString(),
    );

    const priceFormatSpecifier = getMarketPriceFormatSpecifier(
      marketData.priceIncrement,
    );
    const onClosePositionClick = () => {
      show({
        type: 'close_position',
        params: {
          productId: selectedPosition.productId,
        },
      });
    };

    existingLinesByProductId.current.set(
      selectedProductId,
      createOrUpdateEntryLine(
        activeChart,
        selectedPosition,
        priceFormatSpecifier,
        onClosePositionClick,
        existingLine,
      ),
    );
  }, [
    selectedSymbolInfo,
    perpPositionsData,
    marketStaticData?.all,
    tvWidget,
    show,
  ]);
}

function createOrUpdateEntryLine(
  activeChart: IChartWidgetApi,
  selectedPosition: PerpPositionItem,
  priceFormatSpecifier: string,
  onClosePositionClick: () => void,
  existingLine?: IPositionLineAdapter,
): IPositionLineAdapter {
  const sideColor = selectedPosition.amount.isPositive()
    ? COLORS.positive.DEFAULT
    : COLORS.negative.DEFAULT;
  const sideTextColor = selectedPosition.amount.isPositive()
    ? COLORS.positive.muted
    : COLORS.negative.muted;

  const averageEntryPrice = selectedPosition.price.averageEntryPrice.toNumber();
  const contentText = `Entry`;

  const entryLine = existingLine ?? activeChart.createPositionLine();
  return entryLine
    .setPrice(averageEntryPrice)
    .setBodyTextColor(sideTextColor)
    .setBodyBorderColor('')
    .setBodyBackgroundColor(sideColor)
    .setBodyFont(`11px var(${FONTS.default.variable})`)
    .setText(contentText)
    .setLineLength(64) // Distance from orderbox to right-most side of chart
    .setLineStyle(0) // we use 0 (solid) for entry lines, 2 (dashed) for order lines
    .setLineColor(sideColor)
    .setQuantity('')
    .onClose(onClosePositionClick)
    .setCloseButtonBackgroundColor(sideColor)
    .setCloseButtonBorderColor('')
    .setCloseButtonIconColor(sideTextColor);
}