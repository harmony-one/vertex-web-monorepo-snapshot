import { InputValidatorFn } from '@vertex-protocol/web-common';
import { BaseProductMetadata, Token } from 'common/productMetadata/types';

export type PairMetadata = {
  base: BaseProductMetadata;
  quote: Token;
};

export type ProvideLiquidityErrorType =
  | 'invalid_input' // Form input is not valid
  | 'max_mint_exceeded'; // Form input is greater than max available

export type WithdrawLiquidityErrorType =
  | 'max_burn_exceeded' // Form input is greater than max available;
  | 'invalid_input'; // Form input is not valid

export interface ProvideFormValidators {
  validateBaseAmount: InputValidatorFn<string, ProvideLiquidityErrorType>;
  validateQuoteAmount: InputValidatorFn<string, ProvideLiquidityErrorType>;
}

export interface WithdrawFormValidators {
  validateLpAmount: InputValidatorFn<string, WithdrawLiquidityErrorType>;
}
