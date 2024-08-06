import { mergeClassNames, WithChildren } from '@vertex-protocol/web-common';
import { ReactNode } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { TooltipPortal } from './TooltipPortal';
import 'react-popper-tooltip/dist/styles.css';
/**
 * TESTING: added styles import due to deploy issues
 * This version logs the overrides instead of applying them to a TradingView widget.
 * Remove this mock and uncomment the original implementation to re-enable TradingView functionality.
 */
import styles from './BaseTooltip.module.css';

export interface BaseTooltipProps extends WithChildren {
  tooltipContent: ReactNode;
  hideArrow?: boolean;
  tooltipContainerClassName?: string;
  contentWrapperClassName?: string;
  portal?: boolean;
  popperTooltipProps: ReturnType<typeof usePopperTooltip>;
}

export function BaseTooltip({
  children,
  tooltipContent,
  tooltipContainerClassName,
  contentWrapperClassName,
  hideArrow,
  portal,
  popperTooltipProps,
}: BaseTooltipProps) {
  const {
    visible,
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
  } = popperTooltipProps;

  const tooltip = (() => {
    if (!visible) return null;

    return (
      <div
        {...getTooltipProps({
          className: mergeClassNames(
            'text-text-tertiary z-50 shadow-elevation rounded',
            styles['tooltip-container'],
            tooltipContainerClassName,
          ),
        })}
        ref={setTooltipRef}
      >
        {tooltipContent}
        <div
          {...getArrowProps()}
          className={hideArrow ? 'hidden' : styles['tooltip-arrow']}
        />
      </div>
    );
  })();

  return (
    <>
      {portal ? <TooltipPortal>{tooltip}</TooltipPortal> : tooltip}
      <div
        ref={setTriggerRef}
        className={mergeClassNames('cursor-help', contentWrapperClassName)}
      >
        {children}
      </div>
    </>
  );
}
