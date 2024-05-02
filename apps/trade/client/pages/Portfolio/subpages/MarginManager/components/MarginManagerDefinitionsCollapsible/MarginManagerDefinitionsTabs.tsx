import {
  TabsContent,
  TabsList,
  Root as TabsRoot,
  TabsTrigger,
} from '@radix-ui/react-tabs';
import { joinClassNames } from '@vertex-protocol/web-common';
import { CardButton, Divider } from '@vertex-protocol/web-ui';
import { useTabs } from 'client/hooks/ui/tabs/useTabs';
import { HowToUseTheMarginManagerDefinition } from './HowToUseTheMarginManagerDefinition';
import { InitialAndMaintenanceWeightsDefinition } from './InitialAndMaintenanceWeightsDefinition';
import { InitialVsMaintenanceDefinition } from './InitialVsMaintenanceDefinition';
import { LiquidationRiskAndFundsAvailableDefinition } from './LiquidationRiskAndFundsAvailableDefinition';
import { MarginUsageAndFundsAvailableDefinition } from './MarginUsageAndFundsAvailableDefinition';

const MARGIN_MANAGER_TABS = [
  {
    id: 'initial_margin',
    label: 'How to use the Margin Manager',
    content: <HowToUseTheMarginManagerDefinition />,
  },
  {
    id: 'initial_and_maintenance_weights',
    label: 'Initial & Maintenance Weights',
    content: <InitialAndMaintenanceWeightsDefinition />,
  },
  {
    id: 'initial_vs_maintenance_margin',
    label: 'Initial vs. Maintenance Margin',
    content: <InitialVsMaintenanceDefinition />,
  },
  {
    id: 'margin_usage_and_fund_available',
    label: 'Margin Usage & Funds Available',
    content: <MarginUsageAndFundsAvailableDefinition />,
  },
  {
    id: 'liquidation_risk_and_funds_until_liquidation',
    label: 'Liq. Risk & Funds Until Liq.',
    content: <LiquidationRiskAndFundsAvailableDefinition />,
  },
] as const;

export function MarginManagerDefinitionsTabs() {
  const { selectedTabId, setSelectedUntypedTabId, tabs } =
    useTabs(MARGIN_MANAGER_TABS);

  return (
    <TabsRoot
      onValueChange={setSelectedUntypedTabId}
      value={selectedTabId}
      className={joinClassNames(
        'flex flex-col gap-x-12 gap-y-5 sm:flex-row',
        'h-[420px] p-2 sm:h-96',
      )}
    >
      <TabsList
        className={joinClassNames(
          'flex flex-row gap-2 px-1',
          'no-scrollbar overflow-x-auto',
          'sm:flex-1 sm:flex-col',
        )}
      >
        {MARGIN_MANAGER_TABS.map((tab) => {
          const isSelected = tab.id === selectedTabId;

          const stateClassNames = (() => {
            if (isSelected) {
              return [
                'ring-accent',
                'bg-overlay-accent/10 hover:bg-overlay-accent/15',
                'text-text-primary',
              ];
            }
            return [
              'text-text-tertiary',
              'bg-background',
              'hover:text-text-secondary hover:bg-overlay-accent/10',
            ];
          })();

          return (
            <TabsTrigger key={tab.id} value={tab.id} asChild>
              <CardButton
                className={joinClassNames(
                  'flex min-w-max justify-start',
                  'flex-1 font-medium ring-inset',
                  'p-3 lg:py-4',
                  'text-xs lg:text-sm',
                  stateClassNames,
                )}
              >
                {tab.label}
              </CardButton>
            </TabsTrigger>
          );
        })}
      </TabsList>
      <Divider vertical className="hidden lg:flex" />
      {tabs.map(({ id, content }) => (
        <TabsContent
          value={id}
          key={id}
          className={joinClassNames(
            'flex-1 overflow-y-auto',
            'px-2 py-1 lg:pr-6',
          )}
        >
          {content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}