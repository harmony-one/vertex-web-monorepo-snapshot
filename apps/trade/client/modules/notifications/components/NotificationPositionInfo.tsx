import { ProductEngineType } from '@vertex-protocol/contracts';
import { WithClassnames, joinClassNames } from '@vertex-protocol/web-common';
import { getOrderSideLabel } from 'client/modules/trading/utils/getOrderSideLabel';
import { TokenIconMetadata } from 'common/productMetadata/tokenIcons';
import Image from 'next/image';
import { TOAST_MARKET_ICON_CLASSNAME } from './consts';

interface Props extends WithClassnames {
  productType: ProductEngineType;
  isLong: boolean;
  metadata: {
    marketName: string;
    symbol: string;
    icon: TokenIconMetadata;
  };
}

export function NotificationPositionInfo({
  className,
  isLong,
  metadata,
  productType,
}: Props) {
  const isPerp = productType === ProductEngineType.PERP;

  const orderSide = getOrderSideLabel({
    alwaysShowOrderDirection: true,
    isLong,
    isPerp,
  });

  return (
    <div className={joinClassNames('flex items-center gap-x-2', className)}>
      <Image
        className={TOAST_MARKET_ICON_CLASSNAME}
        alt={metadata.marketName}
        src={metadata.icon.asset}
      />
      <div className="flex flex-col">
        <p className="text-text-primary font-medium">{metadata.marketName}</p>
        <p
          className={joinClassNames(
            'text-2xs uppercase',
            isLong ? 'text-positive' : 'text-negative',
          )}
        >
          {orderSide}
        </p>
      </div>
    </div>
  );
}