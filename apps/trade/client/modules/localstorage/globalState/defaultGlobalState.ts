import { SavedGlobalState } from 'client/modules/localstorage/globalState/SavedGlobalState';
import { cloneDeep } from 'lodash';

const DEFAULT_GLOBAL_STATE = Object.freeze<SavedGlobalState>({
  areCookiesAccepted: null,
  lastSelectedChainEnv: undefined,
});

// See getUserSettingsWithDefaults for explanation of implementation
export function getGlobalStateWithDefaults(
  currentSaved: Partial<SavedGlobalState> | undefined,
): SavedGlobalState {
  const withDefaults: SavedGlobalState = {
    areCookiesAccepted:
      currentSaved?.areCookiesAccepted ??
      DEFAULT_GLOBAL_STATE.areCookiesAccepted,
    lastSelectedChainEnv:
      currentSaved?.lastSelectedChainEnv ??
      DEFAULT_GLOBAL_STATE.lastSelectedChainEnv,
  };

  return cloneDeep(withDefaults);
}
