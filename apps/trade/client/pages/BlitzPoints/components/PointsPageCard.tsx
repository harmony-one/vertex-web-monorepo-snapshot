import {
  joinClassNames,
  NextImageSrc,
  WithChildren,
  WithClassnames,
} from '@vertex-protocol/web-common';
import { Card, CARD_ROUNDED_CLASSNAMES } from '@vertex-protocol/web-ui';
import Image from 'next/image';

interface PointsCardProps extends WithClassnames, WithChildren {
  bgImage: NextImageSrc;
}

export function PointsPageCard({
  children,
  className,
  bgImage,
}: PointsCardProps) {
  return (
    // Background color darkens the image
    <Card
      className={joinClassNames('bg-background/80 relative p-6', className)}
    >
      {children}
      {bgImage && (
        <Image
          src={bgImage}
          alt="background"
          fill
          className={joinClassNames(
            '-z-10 object-cover',
            CARD_ROUNDED_CLASSNAMES,
          )}
        />
      )}
    </Card>
  );
}
