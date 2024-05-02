import { hasClass } from '@vertex-protocol/web-common';
import classNames from 'classnames';

import { HomePageButton } from './HomePageButton';
import { ButtonElement, ButtonProps } from './types';

type ColorBorderButtonProps<E extends ButtonElement = 'button'> =
  ButtonProps<E> & {
    borderRadiusFull?: boolean;
  };

export function ColorBorderButton<E extends ButtonElement = 'button'>(
  props: ColorBorderButtonProps<E>,
) {
  const { className, borderRadiusFull, ...rest } = props;

  return (
    <HomePageButton
      className={classNames(
        'relative gap-x-2 overflow-hidden font-bold text-white',
        'bg-black-700 hover:bg-black-800 backdrop-blur-lg hover:brightness-150',
        !hasClass(className, 'mask-') ? 'mask' : undefined,
        borderRadiusFull ? 'rounded-full' : 'rounded-lg',
        className,
      )}
      {...rest}
    />
  );
}