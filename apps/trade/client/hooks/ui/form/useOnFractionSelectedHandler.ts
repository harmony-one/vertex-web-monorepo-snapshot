import { LinkedPercentageAmountFormValues } from 'client/types/linkedPercentageAmountFormTypes';
import { UseFormReturn } from 'react-hook-form';
import { useCallback } from 'react';

export type OnFractionSelectedHandler = (fraction: number) => void;

interface Params<T extends LinkedPercentageAmountFormValues> {
  setValue: UseFormReturn<T>['setValue'];
}

/**
 * Callback for a standard linked percentage/amount input form
 */
export function useOnFractionSelectedHandler<
  T extends LinkedPercentageAmountFormValues,
>({ setValue }: Params<T>) {
  // React hook form doesn't work too well with constrained generics, so force cast here
  const typedSetValue =
    setValue as unknown as UseFormReturn<LinkedPercentageAmountFormValues>['setValue'];

  return useCallback(
    (fraction: number) => {
      if (!fraction) {
        return;
      }
      typedSetValue('amountSource', 'percentage');
      typedSetValue('percentageAmount', fraction);
    },
    [typedSetValue],
  );
}
