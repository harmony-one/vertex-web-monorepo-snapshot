import { SlippageFormForType } from 'client/modules/controlCenter/components/AppSettings/OrderSlippageForm/SlippageFormForType';
import { UseOrderSlippageForm } from 'client/modules/controlCenter/components/AppSettings/OrderSlippageForm/useOrderSlippageForm/useOrderSlippageForm';
import { DefinitionTooltip } from 'client/modules/tooltips/DefinitionTooltip/DefinitionTooltip';

interface Props {
  forms: UseOrderSlippageForm['forms'];
}

export function OrderSlippageForm({ forms }: Props) {
  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <DefinitionTooltip
        contentWrapperClassName="text-text-primary w-fit"
        definitionId="settingsSlippageTolerance"
      >
        Slippage Tolerance
      </DefinitionTooltip>
      <div className="flex flex-col gap-y-2">
        <SlippageFormForType formForType={forms.market} />
        <SlippageFormForType formForType={forms.stopMarket} />
        <SlippageFormForType formForType={forms.takeProfit} />
        <SlippageFormForType formForType={forms.stopLoss} />
      </div>
    </div>
  );
}
