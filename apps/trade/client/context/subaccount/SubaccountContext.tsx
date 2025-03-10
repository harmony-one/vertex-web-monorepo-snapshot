import { WithChildren } from '@vertex-protocol/web-common';
import { useEVMContext } from '@vertex-protocol/web-data';
import { LinkedSignerSync } from 'client/modules/singleSignatureSessions/components/LinkedSignerSync';
import { useSavedSubaccountSigningPreference } from 'client/modules/singleSignatureSessions/hooks/useSavedSubaccountSigningPreference';
import { SubaccountSigningPreference } from 'client/modules/singleSignatureSessions/types';
import { Wallet } from 'ethers';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Subaccount, UpdateSigningPreferenceFn } from './types';

interface SubaccountContextData {
  // Subaccount Name defaults to `default`
  currentSubaccount: Subaccount;
  signingPreference: {
    current?: SubaccountSigningPreference;
    isLoading: boolean;
    update: UpdateSigningPreferenceFn;
  };

  setCurrentSubaccountName(name: string): void;

  // Disconnects the current wallet and cleans up state as needed
  disconnect(): void;
}

const SubaccountContext = createContext<SubaccountContextData>(
  {} as SubaccountContextData,
);

// Hook to consume context
export const useSubaccountContext = () => useContext(SubaccountContext);

/**
 * Context for managing the current subaccount and its signing preferences
 */
export function SubaccountContextProvider({ children }: WithChildren) {
  const { connectionStatus, disconnect: baseDisconnect } = useEVMContext();

  /**
   * Subaccount
   */

  const [currentSubaccountName, setCurrentSubaccountName] = useState('default');

  const currentSubaccount = useMemo((): Subaccount => {
    return {
      name: currentSubaccountName,
      address: connectionStatus?.address,
    };
  }, [currentSubaccountName, connectionStatus?.address]);

  /**
   * Signing preferences
   */

  // Authorized signer for the current session - not persisted
  const [sessionAuthorizedSigner, setSessionAuthorizedSigner] =
    useState<Wallet>();

  // Clear session signer on subaccount change
  useEffect(() => {
    setSessionAuthorizedSigner(undefined);
  }, [currentSubaccount]);

  const {
    signingPreference: savedSigningPreference,
    isLoading: isLoadingSavedSigningPreference,
    saveSigningPreference,
    clearPrivateKeyIfSaved,
  } = useSavedSubaccountSigningPreference(currentSubaccount);

  // Consolidate signing preference with any session state
  const signingPreference = useMemo(() => {
    if (!savedSigningPreference) {
      return;
    }
    if (savedSigningPreference.type === 'sign_always') {
      return savedSigningPreference;
    }
    return {
      ...savedSigningPreference,
      authorizedWallet:
        savedSigningPreference.authorizedWallet ?? sessionAuthorizedSigner,
    };
  }, [savedSigningPreference, sessionAuthorizedSigner]);

  // Update fn for signing preference changes
  const updateSigningPreference = useCallback<UpdateSigningPreferenceFn>(
    (newValue) => {
      if (newValue.type === 'sign_always') {
        saveSigningPreference({
          type: 'sign_always',
        });
        setSessionAuthorizedSigner(undefined);
      } else {
        saveSigningPreference({
          type: 'sign_once',
          rememberMe: newValue.rememberMe,
          privateKey: newValue.rememberMe
            ? newValue.authorizedWallet.privateKey
            : undefined,
        });
        setSessionAuthorizedSigner(newValue.authorizedWallet);
      }
    },
    [saveSigningPreference],
  );

  const disconnect = useCallback(() => {
    clearPrivateKeyIfSaved();
    setSessionAuthorizedSigner(undefined);
    baseDisconnect();
  }, [baseDisconnect, clearPrivateKeyIfSaved]);

  const data: SubaccountContextData = useMemo(() => {
    return {
      currentSubaccount,
      setCurrentSubaccountName,
      signingPreference: {
        current: signingPreference,
        isLoading: isLoadingSavedSigningPreference,
        update: updateSigningPreference,
      },
      disconnect,
    };
  }, [
    currentSubaccount,
    disconnect,
    isLoadingSavedSigningPreference,
    signingPreference,
    updateSigningPreference,
    setCurrentSubaccountName,
  ]);

  return (
    <SubaccountContext.Provider value={data}>
      <LinkedSignerSync />
      {children}
    </SubaccountContext.Provider>
  );
}
