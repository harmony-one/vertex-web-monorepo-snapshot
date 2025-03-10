import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DataTable } from 'client/components/DataTable/DataTable';
import { HeaderCell } from 'client/components/DataTable/cells/HeaderCell';
import { bigDecimalSortFn } from 'client/components/DataTable/utils/sortingFns';
import { useVertexMetadataContext } from 'client/context/vertexMetadata/VertexMetadataContext';
import { EmptyTablePlaceholder } from 'client/modules/tables/EmptyTablePlaceholder';
import { AmountWithSymbolCell } from 'client/modules/tables/cells/AmountWithSymbolCell';
import { DateTimeCell } from 'client/modules/tables/cells/DateTimeCell';
import { MarketInfoWithSideCell } from 'client/modules/tables/cells/MarketInfoWithSideCell';
import { NumberCell } from 'client/modules/tables/cells/NumberCell';
import { useHistoricalTradesTable } from 'client/modules/tables/hooks/useHistoricalTradesTable';
import { HistoricalTradeItem } from 'client/modules/tables/types/HistoricalTradeItem';
import { MarketFilter } from 'client/types/MarketFilter';
import {
  CustomNumberFormatSpecifier,
  PresetNumberFormatSpecifier,
} from 'client/utils/formatNumber/NumberFormatSpecifier';
import { getMarketPriceFormatSpecifier } from 'client/utils/formatNumber/getMarketPriceFormatSpecifier';
import { useMemo } from 'react';
import { OrderTypeCell } from './cells/OrderTypeCell';

interface Props {
  marketFilter?: MarketFilter;
  pageSize: number;
  showPagination?: boolean;
  hasBackground?: boolean;
}

const columnHelper = createColumnHelper<HistoricalTradeItem>();

export function PaginatedHistoricalTradesTable({
  pageSize,
  showPagination,
  hasBackground,
  marketFilter,
}: Props) {
  const { primaryQuoteToken } = useVertexMetadataContext();
  const {
    mappedData,
    pageCount,
    paginationState,
    setPaginationState,
    isLoading,
  } = useHistoricalTradesTable({
    pageSize,
    enablePagination: !!showPagination,
    marketFilter,
  });

  const columns: ColumnDef<HistoricalTradeItem, any>[] = useMemo(() => {
    return [
      columnHelper.accessor('timestampMillis', {
        header: ({ header }) => <HeaderCell header={header}>Time</HeaderCell>,
        cell: (context) => (
          <DateTimeCell timestampMillis={context.getValue()} />
        ),
        sortingFn: 'basic',
        meta: {
          cellContainerClassName: 'w-28',
        },
      }),
      columnHelper.accessor('marketInfo', {
        header: ({ header }) => (
          <HeaderCell header={header}>Market / Action</HeaderCell>
        ),
        cell: (context) => (
          <MarketInfoWithSideCell
            alwaysShowOrderDirection
            marketInfo={context.getValue()}
          />
        ),
        enableSorting: false,
        meta: {
          cellContainerClassName: 'w-40',
        },
      }),
      columnHelper.accessor('orderType', {
        header: ({ header }) => <HeaderCell header={header}>Type</HeaderCell>,
        cell: (context) => <OrderTypeCell value={context.getValue()} />,
        enableSorting: false,
        meta: {
          cellContainerClassName: 'w-24',
        },
      }),
      columnHelper.accessor('filledPrice', {
        header: ({ header }) => (
          <HeaderCell header={header}>Avg. Price</HeaderCell>
        ),
        cell: (context) => (
          <NumberCell
            value={context.getValue()}
            formatSpecifier={getMarketPriceFormatSpecifier(
              context.row.original.marketInfo.priceIncrement,
            )}
          />
        ),
        sortingFn: bigDecimalSortFn,
        meta: {
          cellContainerClassName: 'w-32',
        },
      }),
      columnHelper.accessor('filledAmountAbs', {
        header: ({ header }) => <HeaderCell header={header}>Amount</HeaderCell>,
        cell: (context) => (
          <AmountWithSymbolCell
            amount={context.getValue()}
            symbol={context.row.original.marketInfo.symbol}
            // Spot market orders can be of arbitrary size, so we show as much precision as possible
            formatSpecifier={CustomNumberFormatSpecifier.NUMBER_PRECISE}
          />
        ),
        sortingFn: bigDecimalSortFn,
        meta: {
          cellContainerClassName: 'w-40',
        },
      }),
      columnHelper.accessor('tradeTotalCost', {
        header: ({ header }) => <HeaderCell header={header}>Total</HeaderCell>,
        cell: (context) => (
          <AmountWithSymbolCell
            amount={context.getValue()}
            symbol={primaryQuoteToken.symbol}
            formatSpecifier={PresetNumberFormatSpecifier.NUMBER_2DP}
          />
        ),
        sortingFn: bigDecimalSortFn,
        meta: {
          cellContainerClassName: 'w-32',
        },
      }),
      columnHelper.accessor('tradeFee', {
        header: ({ header }) => (
          <HeaderCell header={header}>Trade Fee</HeaderCell>
        ),
        cell: (context) => (
          <AmountWithSymbolCell
            amount={context.getValue()}
            symbol={primaryQuoteToken.symbol}
            formatSpecifier={PresetNumberFormatSpecifier.NUMBER_2DP}
          />
        ),
        sortingFn: bigDecimalSortFn,
        meta: {
          cellContainerClassName: 'w-32',
        },
      }),
      columnHelper.accessor('sequencerFee', {
        header: ({ header }) => (
          <HeaderCell
            header={header}
            definitionTooltipId="historicalTradesSequencerFee"
          >
            Sequencer Fee
          </HeaderCell>
        ),
        cell: (context) => (
          <AmountWithSymbolCell
            amount={context.getValue()}
            symbol={primaryQuoteToken.symbol}
            formatSpecifier={PresetNumberFormatSpecifier.NUMBER_2DP}
          />
        ),
        sortingFn: bigDecimalSortFn,
        meta: {
          cellContainerClassName: 'w-32 grow',
        },
      }),
    ];
  }, [primaryQuoteToken.symbol]);

  return (
    <DataTable
      columns={columns}
      data={mappedData}
      isLoading={isLoading}
      emptyState={<EmptyTablePlaceholder type="trades_history" />}
      paginationState={showPagination ? paginationState : undefined}
      setPaginationState={showPagination ? setPaginationState : undefined}
      pageCount={showPagination ? pageCount : 1}
      hasBackground={hasBackground}
    />
  );
}
