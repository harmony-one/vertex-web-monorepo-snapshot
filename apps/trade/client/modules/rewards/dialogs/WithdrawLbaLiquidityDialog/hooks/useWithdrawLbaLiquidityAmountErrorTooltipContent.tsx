import { useMemo } from 'react';
import { WithdrawLbaLiquidityErrorType } from '../hooks/types';

export function useWithdrawLbaLiquidityAmountErrorTooltipContent({
  formError,
}: {
  formError: WithdrawLbaLiquidityErrorType | undefined;
}) {
  return useMemo(() => {
    switch (formError) {
      case 'invalid_input':
        return 'Please enter a valid amount.';
      case 'max_exceeded':
        return "You can't withdraw more than your unlocked LP token balance. Please enter a valid amount.";
      default:
        return null;
    }
  }, [formError]);
}