import { BigDecimal } from '@vertex-protocol/utils';
import { formatNumber } from 'client/utils/formatNumber/formatNumber';
import {
  CustomNumberFormatSpecifier,
  PresetNumberFormatSpecifier,
} from 'client/utils/formatNumber/NumberFormatSpecifier';
import { signDependentValue } from 'client/utils/signDependentValue';

interface ClosePositionSummaryProps {
  productName: string | undefined;
  amountClosedPnl: BigDecimal | undefined;
  amountRealizedPnL: BigDecimal | undefined;
}

export function ClosePositionSummary({
  amountRealizedPnL,
  amountClosedPnl,
  productName,
}: ClosePositionSummaryProps) {
  if (!productName || !amountClosedPnl || !amountRealizedPnL) {
    return null;
  }

  const formattedAmountCloseSize = formatNumber(amountClosedPnl, {
    formatSpecifier: CustomNumberFormatSpecifier.NUMBER_AUTO,
  });

  const formattedRealizedPnL = formatNumber(amountRealizedPnL.abs(), {
    formatSpecifier: PresetNumberFormatSpecifier.CURRENCY_2DP,
  });

  return (
    <div className="text-text-secondary text-xs">
      You will close&nbsp;
      <span className="text-text-primary font-medium">
        {formattedAmountCloseSize}
        &nbsp;{productName}&nbsp;
      </span>
      with an estimated&nbsp;
      {amountRealizedPnL.isPositive() ? 'profit' : 'loss'} of&nbsp;
      <span
        className={signDependentValue(amountRealizedPnL, {
          positive: 'text-positive',
          negative: 'text-negative',
          zero: 'text-text-primary',
        })}
      >
        {formattedRealizedPnL}
      </span>
    </div>
  );
}
