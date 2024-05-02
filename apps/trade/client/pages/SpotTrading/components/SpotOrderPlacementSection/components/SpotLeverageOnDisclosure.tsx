import { CheckedState } from '@radix-ui/react-checkbox';
import { joinClassNames } from '@vertex-protocol/web-common';
import {
  Checkbox,
  DiscList,
  DisclosureCard,
  PrimaryButton,
} from '@vertex-protocol/web-ui';
import { LinkButton } from 'client/components/LinkButton';
import { LINKS } from 'client/modules/brand/links';
import { useShowUserDisclosure } from 'client/modules/localstorage/userState/useShowUserDisclosure';
import Link from 'next/link';
import { useState } from 'react';

export function SpotLeverageOnDisclosure() {
  const [checked, setChecked] = useState(false);
  const { dismiss: dismissLeverageDisclosure } = useShowUserDisclosure(
    'spot_leverage_on_risk',
  );

  const onCheckedChange = (state: CheckedState) => {
    setChecked(!!state);
  };

  return (
    // This div is required to block interaction with the parent form
    <div className="absolute inset-0">
      {/* Overlay */}
      <div
        className={joinClassNames(
          'absolute inset-0 z-10',
          'cursor-not-allowed backdrop-blur-sm',
        )}
      />
      <div
        className={joinClassNames(
          'bg-surface-1',
          'absolute z-20 flex flex-col',
          'gap-y-4 px-4 pb-2.5',
        )}
      >
        <DisclosureCard
          className="border-stroke bg-surface-1 border"
          title="Switching Leverage ON"
          description={
            <div className="flex flex-col gap-y-2.5">
              <p>
                Leverage spot lets you auto-borrow assets, against your margin,
                to buy or sell more than you have. Borrowing increases risk.
                Check the box to continue.
              </p>
              <DiscList.Container>
                <DiscList.Item>
                  <LinkButton
                    as={Link}
                    color="accent"
                    href={LINKS.spotTradingLearnMore}
                    external
                  >
                    Learn More
                  </LinkButton>
                </DiscList.Item>
                <DiscList.Item>
                  <LinkButton
                    as={Link}
                    color="accent"
                    href={LINKS.termsOfUse}
                    external
                  >
                    Understand the Risks
                  </LinkButton>
                </DiscList.Item>
              </DiscList.Container>
            </div>
          }
        />
        <div className="text-text-secondary flex flex-col gap-y-2.5 text-xs">
          <div className="flex items-center gap-x-2">
            <Checkbox.Row>
              <Checkbox.Check
                id="spot-leverage-disclaimer"
                checked={checked}
                onCheckedChange={onCheckedChange}
              />
              <Checkbox.Label id="spot-leverage-disclaimer">
                I understand the risks
              </Checkbox.Label>
            </Checkbox.Row>
          </div>
          <PrimaryButton
            size="lg"
            className="w-full"
            disabled={!checked}
            onClick={dismissLeverageDisclosure}
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}