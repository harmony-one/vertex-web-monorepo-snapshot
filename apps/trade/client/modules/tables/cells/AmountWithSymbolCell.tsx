import { BigDecimal } from '@vertex-protocol/utils';
import { AmountWithSymbol } from 'client/components/AmountWithSymbol';
import {
  TableCell,
  TableCellProps,
} from 'client/components/DataTable/cells/TableCell';
import { formatNumber } from 'client/utils/formatNumber/formatNumber';
import { NumberFormatSpecifier } from 'client/utils/formatNumber/NumberFormatSpecifier';

interface Props extends TableCellProps {
  // The asset size to display
  amount: BigDecimal | undefined;
  // The asset symbol to display
  symbol: string | undefined;
  formatSpecifier: NumberFormatSpecifier | string;
}

export function AmountWithSymbolCell({
  amount,
  symbol,
  formatSpecifier,
  ...rest
}: Props) {
  const formattedSize = formatNumber(amount, {
    formatSpecifier,
  });
  return (
    <TableCell {...rest}>
      <AmountWithSymbol formattedSize={formattedSize} symbol={symbol} />
    </TableCell>
  );
}
