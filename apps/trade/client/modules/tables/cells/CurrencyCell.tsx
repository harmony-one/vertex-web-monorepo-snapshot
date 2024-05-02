import { BigDecimal } from '@vertex-protocol/utils';
import { PresetNumberFormatSpecifier } from 'client/utils/formatNumber/NumberFormatSpecifier';
import { formatNumber } from 'client/utils/formatNumber/formatNumber';
import {
  TableCell,
  TableCellProps,
} from 'client/components/DataTable/cells/TableCell';

interface Props extends TableCellProps {
  // The dollar value to display
  value: BigDecimal | undefined;
  formatSpecifier?: string;
}

export function CurrencyCell({ value, formatSpecifier, ...rest }: Props) {
  const formattedValue = formatNumber(value, {
    formatSpecifier:
      formatSpecifier ?? PresetNumberFormatSpecifier.CURRENCY_2DP,
  });
  return <TableCell {...rest}>{formattedValue}</TableCell>;
}