import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { WithClassnames } from '@vertex-protocol/web-common';
import { DataTable } from 'client/components/DataTable/DataTable';
import { HeaderCell } from 'client/components/DataTable/cells/HeaderCell';
import { StackedTableCell } from 'client/components/DataTable/cells/StackedTableCell';
import { getKeyedBigDecimalSortFn } from 'client/components/DataTable/utils/sortingFns';
import { EmptyTablePlaceholder } from 'client/modules/tables/EmptyTablePlaceholder';
import { AmountWithSymbolCell } from 'client/modules/tables/cells/AmountWithSymbolCell';
import { CurrencyCell } from 'client/modules/tables/cells/CurrencyCell';
import { StackedTokenPairCell } from 'client/modules/tables/cells/StackedTokenPairCell';
import { TitleHeaderCell } from 'client/modules/tables/cells/TitleHeaderCell';
import { CustomNumberFormatSpecifier } from 'client/utils/formatNumber/NumberFormatSpecifier';
import { useMemo } from 'react';
import { CalculatorIconHeaderCell } from './cells/CalculatorIconHeaderCell';
import { MarginManagerActionsCell } from './cells/MarginManagerActionsCell';
import { MarginWeightCell } from './cells/MarginWeightCell';
import { MarginWeightHeaderCell } from './cells/MarginWeightHeaderCell';
import {
  MarginManagerPoolsTableItem,
  useMarginManagerPoolsTable,
} from './hooks/useMarginManagerPoolsTable';

const columnHelper = createColumnHelper<MarginManagerPoolsTableItem>();

export function MarginManagerPoolsTable({ className }: WithClassnames) {
  const { data: pools, isLoading } = useMarginManagerPoolsTable();

  const columns: ColumnDef<MarginManagerPoolsTableItem, any>[] = useMemo(() => {
    return [
      columnHelper.accessor('metadata', {
        header: ({ header }) => (
          <TitleHeaderCell header={header}>Pools</TitleHeaderCell>
        ),
        cell: ({ getValue }) => {
          const metadata = getValue<MarginManagerPoolsTableItem['metadata']>();
          return <StackedTokenPairCell metadata={metadata} />;
        },
        enableSorting: false,
        meta: {
          cellContainerClassName: 'w-32',
        },
      }),
      columnHelper.accessor('valueUsd', {
        header: ({ header }) => (
          <HeaderCell header={header}>Liquidity Provided</HeaderCell>
        ),
        cell: (context) => {
          return (
            <CurrencyCell
              value={context.getValue<
                MarginManagerPoolsTableItem['valueUsd']
              >()}
            />
          );
        },
        enableSorting: false,
        meta: {
          cellContainerClassName: 'w-36',
        },
      }),
      columnHelper.accessor('amounts', {
        id: 'details',
        header: ({ header }) => (
          <HeaderCell
            header={header}
            definitionTooltipId="lpPositionComposition"
          >
            LP Composition
          </HeaderCell>
        ),
        cell: (context) => {
          const { baseAmount, quoteAmount } =
            context.getValue<MarginManagerPoolsTableItem['amounts']>();
          const metadata = context.row.original.metadata;
          return (
            <StackedTableCell
              top={
                <AmountWithSymbolCell
                  amount={baseAmount}
                  symbol={metadata.base.symbol}
                  formatSpecifier={CustomNumberFormatSpecifier.NUMBER_AUTO}
                  className="pl-0"
                />
              }
              bottom={
                <AmountWithSymbolCell
                  amount={quoteAmount}
                  symbol={metadata.quote.symbol}
                  formatSpecifier={CustomNumberFormatSpecifier.NUMBER_AUTO}
                  className="pl-0"
                />
              }
            />
          );
        },
        enableSorting: false,
        meta: {
          cellContainerClassName: 'w-36 grow',
        },
      }),
      columnHelper.accessor('initialHealth', {
        header: ({ header }) => (
          <MarginWeightHeaderCell isInitial header={header} />
        ),
        cell: ({ getValue }) => {
          return <MarginWeightCell marginWeightMetrics={getValue()} />;
        },
        sortingFn: getKeyedBigDecimalSortFn('marginUsd'),
        meta: {
          cellContainerClassName: 'w-44',
        },
      }),
      columnHelper.accessor('maintenanceHealth', {
        header: ({ header }) => (
          <MarginWeightHeaderCell isInitial={false} header={header} />
        ),
        cell: ({ getValue }) => {
          return <MarginWeightCell marginWeightMetrics={getValue()} />;
        },
        sortingFn: getKeyedBigDecimalSortFn('marginUsd'),
        meta: {
          cellContainerClassName: 'w-44',
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: ({ header }) => (
          <CalculatorIconHeaderCell
            definitionTooltipId="marginManagerLpPositionsMarginCalc"
            header={header}
          />
        ),
        cell: (context) => {
          const productId = context.row.original.productId;

          return (
            <MarginManagerActionsCell
              actions={[
                {
                  type: 'provide_liquidity',
                  label: 'Provide',
                  productId,
                },
                {
                  type: 'withdraw_liquidity',
                  label: 'Withdraw',
                  productId,
                },
              ]}
            />
          );
        },
        meta: {
          // Adding widths to align weight/margin cols and breakpointing to address gap between them and actions cell on mobile
          cellContainerClassName: 'w-16 sm:w-32',
        },
      }),
    ];
  }, []);

  return (
    <DataTable
      columns={columns}
      data={pools}
      isLoading={isLoading}
      emptyState={<EmptyTablePlaceholder type="pool_positions" />}
      hasBackground
      tableContainerClassName={className}
    />
  );
}
