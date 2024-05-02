import { ChainEnv } from '@vertex-protocol/client';

export interface SavedGlobalState {
  // Null indicates that the user has not yet made a decision
  areCookiesAccepted: boolean | null;
  lastSelectedChainEnv: ChainEnv | undefined;
}