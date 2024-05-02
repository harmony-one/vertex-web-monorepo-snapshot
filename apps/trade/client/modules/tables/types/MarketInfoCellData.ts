import { ProductEngineType } from '@vertex-protocol/contracts';
import { BigDecimal } from '@vertex-protocol/utils';
import { TokenIconMetadata } from 'common/productMetadata/tokenIcons';

export interface MarketInfoCellData {
  marketName: string;
  icon: TokenIconMetadata;
  symbol: string;
  amountForSide: BigDecimal;
  productType: ProductEngineType;
  sizeIncrement: BigDecimal;
  priceIncrement: BigDecimal;
}