import { BigDecimal, toBigDecimal } from '@vertex-protocol/utils';
import {
  InputValidatorFn,
  percentageValidator,
  safeParseForData,
} from '@vertex-protocol/web-common';
import { useExecuteMintLp } from 'client/hooks/execute/useExecuteMintLp';
import { useLpYields } from 'client/hooks/markets/useLpYields';
import { useMarket } from 'client/hooks/markets/useMarket';
import { useQuotePriceUsd } from 'client/hooks/markets/useQuotePriceUsd';
import { useMaxMintLpAmount } from 'client/hooks/query/subaccount/useMaxMintLpAmount';
import {
  LpBalanceItem,
  useLpBalances,
} from 'client/hooks/subaccount/useLpBalances';
import { useQuoteBalance } from 'client/hooks/subaccount/useQuoteBalance';
import { OnFractionSelectedHandler } from 'client/hooks/ui/form/useOnFractionSelectedHandler';
import { useRunWithDelayOnCondition } from 'client/hooks/util/useRunWithDelayOnCondition';
import { useDialog } from 'client/modules/app/dialogs/hooks/useDialog';
import { useNotificationManagerContext } from 'client/modules/notifications/NotificationManagerContext';
import { provideLiquidityProductIdAtom } from 'client/store/collateralStore';
import { BaseActionButtonState } from 'client/types/BaseActionButtonState';
import { BigDecimals } from 'client/utils/BigDecimals';
import { addDecimals, removeDecimals } from 'client/utils/decimalAdjustment';
import { toSafeFormPercentage } from 'client/utils/form/toSafeFormPercentage';
import { watchFormError } from 'client/utils/form/watchFormError';
import { getBaseProductMetadata } from 'client/utils/getBaseProductMetadata';
import { positiveBigDecimalValidator } from 'client/utils/inputValidators';
import { roundToString } from 'client/utils/rounding';
import { safeDiv } from 'client/utils/safeDiv';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { PairMetadata, ProvideLiquidityErrorType } from '../../types';
import { useProvideLiquidityValidators } from './useProvideLiquidityValidators';

export interface ProvideLiquidityFormValues {
  baseAmount: string;
  quoteAmount: string;
  percentageAmount: number;
  amountSource: 'base' | 'quote' | 'percentage';
}

export interface UseProvideLiquidityForm {
  form: UseFormReturn<ProvideLiquidityFormValues>;
  underlyingBaseBalance: BigDecimal | undefined;
  underlyingQuoteBalance: BigDecimal | undefined;
  buttonState: BaseActionButtonState;
  validPercentageAmount: number | undefined;
  currentYield: BigDecimal;
  metadata: PairMetadata | undefined;
  estimatedChangeAmounts:
    | {
        base: BigDecimal;
        quote: BigDecimal;
        lpTokens: BigDecimal;
        baseValueUsd: BigDecimal;
        quoteValueUsd: BigDecimal;
        lpValueUsd: BigDecimal;
      }
    | undefined;
  formError: ProvideLiquidityErrorType | undefined;
  currentLpBalance: LpBalanceItem | undefined;
  onFractionSelected: OnFractionSelectedHandler;
  validateBaseAmount: InputValidatorFn<string, ProvideLiquidityErrorType>;
  validateQuoteAmount: InputValidatorFn<string, ProvideLiquidityErrorType>;

  onMaxSelected(): void;

  onSubmit(): void;
}

// Use user input as the "midpoint" of quote amount high & low
// quoteAmountHigh => this would usually be (1 + slippage) * (fair value of base = oracle price * base amount)
// quoteAmountLow => but this would usually be (1 - slippage) * (fair value of base = oracle price * base amount)
// so in our case, quote input = quote high amount is (1 + slippage) * (oracle price * base amount)
const SLIPPAGE = 0.01;

// Currently LPs are limited to no leverage spot
const spotLeverage = false;

export function useProvideLiquidityForm(): UseProvideLiquidityForm {
  const { dispatchNotification } = useNotificationManagerContext();
  const [productIdAtomValue] = useAtom(provideLiquidityProductIdAtom);

  const { data: marketData } = useMarket({ productId: productIdAtomValue });
  const quotePrice = useQuotePriceUsd();
  const { data: lpYields } = useLpYields();

  const { balances } = useLpBalances();
  const { data: quoteBalance } = useQuoteBalance();

  const { data: maxMintLpAmount } = useMaxMintLpAmount({
    productId: productIdAtomValue ?? 0,
    spotLeverage,
  });
  const { hide } = useDialog();

  // Mutation to mint LP tokens
  const executeMintLp = useExecuteMintLp();

  useRunWithDelayOnCondition({
    condition: executeMintLp.isSuccess,
    fn: hide,
  });

  /**
   * Form state
   */
  const useProvideLiquidityForm = useForm<ProvideLiquidityFormValues>({
    defaultValues: {
      amountSource: 'base',
      baseAmount: '',
      quoteAmount: '',
      percentageAmount: 0,
    },
    mode: 'onTouched',
  });

  const { setValue, watch, resetField, handleSubmit } = useProvideLiquidityForm;

  // Watched inputs
  const percentageAmountInput = watch('percentageAmount');
  const baseAmountInput = watch('baseAmount');
  const quoteAmountInput = watch('quoteAmount');
  const amountSource = watch('amountSource');

  /**
   * Current LP pair information
   */

  // Current subaccount LP balance
  const currentLpBalance = useMemo(() => {
    return balances?.find(
      (balance) => balance.productId === productIdAtomValue,
    );
  }, [balances, productIdAtomValue]);

  // Current subaccount LP yield
  const currentYield = useMemo(() => {
    if (!productIdAtomValue || !lpYields) {
      return BigDecimals.ZERO;
    }
    return lpYields[productIdAtomValue] ?? BigDecimals.ZERO;
  }, [lpYields, productIdAtomValue]);

  // Metadata for the current pair
  const pairMetadata = useMemo((): PairMetadata | undefined => {
    if (!currentLpBalance || !quoteBalance) {
      return undefined;
    }
    return {
      base: getBaseProductMetadata(currentLpBalance.product.metadata),
      quote: quoteBalance.metadata.token,
    };
  }, [currentLpBalance, quoteBalance]);

  // Decimal adjusted max amounts that can be added to the pool
  const decimalAdjustedMaxLpAmounts = useMemo(() => {
    if (!maxMintLpAmount) {
      return undefined;
    }

    return {
      base: removeDecimals(maxMintLpAmount.maxBaseAmount),
      quote: removeDecimals(maxMintLpAmount.maxQuoteAmount),
    };
  }, [maxMintLpAmount]);

  // Conversion ratio = amount quote : amount base, when minting LP, the ideal conversion ratio is the current oracle price
  const conversionRatio = useMemo(() => {
    if (!marketData) {
      return undefined;
    }

    // If max amounts are available, use it for conversion ratio to ensure that max size validators
    // are consistent with the linked inputs
    if (maxMintLpAmount?.maxBaseAmount.gt(0)) {
      return maxMintLpAmount.maxQuoteAmount.div(maxMintLpAmount.maxBaseAmount);
    }
    // Default to market oracle price
    return marketData.product.oraclePrice;
  }, [marketData, maxMintLpAmount]);

  /**
   * Error handling
   */
  const { validateBaseAmount, validateQuoteAmount } =
    useProvideLiquidityValidators({
      maxBaseLpAmount: decimalAdjustedMaxLpAmounts?.base,
      maxQuoteLpAmount: decimalAdjustedMaxLpAmounts?.quote,
    });

  // Watched input errors
  const baseAmountError: ProvideLiquidityErrorType | undefined = watchFormError(
    useProvideLiquidityForm,
    'baseAmount',
  );
  const quoteAmountError: ProvideLiquidityErrorType | undefined =
    watchFormError(useProvideLiquidityForm, 'quoteAmount');

  // Parsed amounts
  const validBaseAmount = useMemo(() => {
    return safeParseForData(positiveBigDecimalValidator, baseAmountInput);
  }, [baseAmountInput]);
  const validQuoteAmount = useMemo(() => {
    return safeParseForData(positiveBigDecimalValidator, quoteAmountInput);
  }, [quoteAmountInput]);
  const validPercentageAmount = useMemo(() => {
    return safeParseForData(percentageValidator, percentageAmountInput);
  }, [percentageAmountInput]);

  // Validation for entire form
  const formError = useMemo((): ProvideLiquidityErrorType | undefined => {
    if (baseAmountError) {
      return baseAmountError;
    }
    if (quoteAmountError) {
      return quoteAmountError;
    }
  }, [baseAmountError, quoteAmountError]);

  // Action button state
  const buttonState = useMemo((): BaseActionButtonState => {
    if (executeMintLp.isPending) {
      return 'loading';
    }
    if (executeMintLp.isSuccess) {
      return 'success';
    }
    if (!validBaseAmount || !validQuoteAmount || formError) {
      return 'disabled';
    }
    return 'idle';
  }, [executeMintLp, formError, validBaseAmount, validQuoteAmount]);

  /**
   * Input handlers/triggers
   */

  // Triggered when the user changes the base amount input
  useEffect(
    () => {
      if (amountSource !== 'base') {
        return;
      }

      // Change quote amount
      if (validBaseAmount && conversionRatio) {
        setValue(
          'quoteAmount',
          toAssetInput(validBaseAmount.multipliedBy(conversionRatio)),
          {
            shouldValidate: true,
            shouldTouch: true,
          },
        );
      } else {
        resetField('quoteAmount');
      }
      // Change percentage amount
      setValue(
        'percentageAmount',
        toSafeFormPercentage(
          validBaseAmount,
          decimalAdjustedMaxLpAmounts?.base,
        ),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validBaseAmount],
  );

  // Triggered when the user changes the quote amount input
  useEffect(
    () => {
      if (amountSource !== 'quote') {
        return;
      }

      // Change base amount
      if (validQuoteAmount && conversionRatio) {
        setValue(
          'baseAmount',
          toAssetInput(validQuoteAmount.div(conversionRatio)),
          {
            shouldValidate: true,
            shouldTouch: true,
          },
        );
      } else {
        resetField('baseAmount');
      }
      // Change percentage amount
      setValue(
        'percentageAmount',
        toSafeFormPercentage(
          validQuoteAmount,
          decimalAdjustedMaxLpAmounts?.quote,
        ),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validQuoteAmount],
  );

  // Triggered when the user changes the percentage amount input
  useEffect(
    () => {
      if (amountSource !== 'percentage') {
        return;
      }
      if (validPercentageAmount != null && decimalAdjustedMaxLpAmounts) {
        const baseAmount = decimalAdjustedMaxLpAmounts.base.multipliedBy(
          validPercentageAmount,
        );
        const quoteAmount = decimalAdjustedMaxLpAmounts.quote.multipliedBy(
          validPercentageAmount,
        );
        // Set the base amount to the max amount * percentage
        setValue('baseAmount', toAssetInput(baseAmount), {
          shouldValidate: true,
          shouldTouch: true,
        });
        // Set the quote amount to the equivalent * percentage
        setValue('quoteAmount', toAssetInput(quoteAmount), {
          shouldValidate: true,
          shouldTouch: true,
        });
      } else {
        resetField('quoteAmount');
        resetField('baseAmount');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validPercentageAmount],
  );

  // Estimated change amounts based on user input
  const estimatedChangeAmounts = useMemo(() => {
    if (
      !validBaseAmount ||
      !validQuoteAmount ||
      !currentLpBalance ||
      !marketData ||
      !quoteBalance
    ) {
      return undefined;
    }
    const quoteValueUsd = validQuoteAmount.multipliedBy(quotePrice);
    const baseValueUsd = validBaseAmount
      .multipliedBy(currentLpBalance.oraclePrice)
      .multipliedBy(quotePrice);
    return {
      base: validBaseAmount,
      quote: validQuoteAmount,
      lpTokens: safeDiv(
        marketData.product.totalLpSupply.multipliedBy(validBaseAmount),
        marketData.product.totalLpBaseAmount,
      ),
      baseValueUsd,
      quoteValueUsd,
      lpValueUsd: quoteValueUsd.plus(quoteValueUsd),
    };
  }, [
    validBaseAmount,
    validQuoteAmount,
    currentLpBalance,
    marketData,
    quoteBalance,
    quotePrice,
  ]);

  // Set the amount source to percentage when a fraction button is clicked
  // and set the percentage amount to the fraction.
  const onFractionSelected = useCallback(
    (fraction: number) => {
      setValue('amountSource', 'percentage');
      setValue('percentageAmount', fraction);
    },
    [setValue],
  );

  const onMaxSelected = useCallback(
    () => onFractionSelected(1),
    [onFractionSelected],
  );

  // Form submit handler
  const onSubmitForm = useCallback(
    (values: ProvideLiquidityFormValues) => {
      if (!marketData) {
        return;
      }

      const baseAmount = toBigDecimal(values.baseAmount);
      // Instead of using the quote amount from values, derive directly from the conversion price if available
      // this should be slightly more accurate because quoteAmount is truncated
      const quoteAmountMid = conversionRatio
        ? baseAmount.multipliedBy(conversionRatio)
        : toBigDecimal(values.quoteAmount);
      // The high amount must not exceed the user's max quote size after the slippage adjustment
      const quoteAmountHighWithSlippage = quoteAmountMid.multipliedBy(
        1 + SLIPPAGE,
      );
      const quoteAmountHigh = decimalAdjustedMaxLpAmounts
        ? BigDecimal.min(
            quoteAmountHighWithSlippage,
            decimalAdjustedMaxLpAmounts.quote,
          )
        : quoteAmountHighWithSlippage;
      const quoteAmountLow = quoteAmountMid.multipliedBy(1 - SLIPPAGE);

      const mintLpResult = executeMintLp.mutateAsync(
        {
          productId: marketData.productId,
          amountBase: roundToString(addDecimals(baseAmount), 0),
          quoteAmountLow: roundToString(addDecimals(quoteAmountLow), 0),
          quoteAmountHigh: roundToString(addDecimals(quoteAmountHigh), 0),
          spotLeverage,
        },
        {
          onSuccess: () => {
            resetField('baseAmount');
            resetField('quoteAmount');
            setValue('percentageAmount', 0);
            setValue('amountSource', 'base');
          },
        },
      );

      if (estimatedChangeAmounts) {
        dispatchNotification({
          type: 'action_error_handler',
          data: {
            errorNotificationTitle: 'Provide Liquidity Failed',
            executionData: {
              serverExecutionResult: mintLpResult,
            },
          },
        });
      }
    },
    [
      marketData,
      conversionRatio,
      decimalAdjustedMaxLpAmounts,
      executeMintLp,
      estimatedChangeAmounts,
      resetField,
      setValue,
      dispatchNotification,
    ],
  );

  return {
    form: useProvideLiquidityForm,
    metadata: pairMetadata,
    currentLpBalance,
    currentYield,
    underlyingBaseBalance: currentLpBalance?.underlyingAmount,
    underlyingQuoteBalance: quoteBalance?.amount,
    formError,
    buttonState,
    validPercentageAmount,
    estimatedChangeAmounts,
    onFractionSelected,
    onMaxSelected,
    validateBaseAmount,
    validateQuoteAmount,
    onSubmit: handleSubmit(onSubmitForm),
  };
}

function toAssetInput(value: BigDecimal) {
  return roundToString(value, 6, BigDecimal.ROUND_DOWN);
}
