import { useSwitchChain } from 'wagmi';
import { getEthersProvider } from 'libs/wagmi/ethers';
import { wagmiConfig } from 'libs/wagmi/config';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { getConnectors } from '@wagmi/core';
import { RPC_URLS, RPC_HEADERS, CHAIN_ID } from 'libs/wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { currentChain } from './chains';
import { selectedConnections } from './wagmi.constants';
import { isPlaceHolderConnector } from './connectors';

export const useWagmiNetwork = () => {
  const { switchChain } = useSwitchChain();
  const chainId = currentChain.id;

  const provider = getEthersProvider(wagmiConfig, chainId);

  const [isNetworkActive, setIsNetworkActive] = useState(false);

  const [networkError, setNetworkError] = useState<string>();

  const networkProvider = useMemo(() => {
    return new StaticJsonRpcProvider(
      {
        url: RPC_URLS[CHAIN_ID],
        headers: RPC_HEADERS[CHAIN_ID],
        skipFetchSetup: true,
      },
      chainId
    );
  }, [chainId]);

  const switchNetwork = useCallback(
    /**
     * Switch network to specified chainId, using the wagmi config chains
     * @param {number} chainId ChainId to switch to
     */
    () => switchChain({ chainId }),
    [chainId, switchChain]
  );

  const activateNetwork = useCallback(async () => {
    if (networkError || isNetworkActive) {
      return;
    }

    try {
      await networkProvider.getNetwork();
      setIsNetworkActive(true);
    } catch (e: any) {
      const msg = e.message || 'Could not activate network: UNKNOWN ERROR';
      console.error('activateNetwork failed.', msg);
      setNetworkError(msg);
    }
  }, [isNetworkActive, networkError, networkProvider]);

  useEffect(() => {
    void activateNetwork();
  }, [activateNetwork]);

  const wagmiConnectors = getConnectors(wagmiConfig);
  const connectors = useMemo(() => {
    const wagmiConnectorsNames = wagmiConnectors.map((c) =>
      c.name.toLowerCase()
    );
    const duplicatedConnectorNames = wagmiConnectorsNames.filter(
      (e, i, a) => a.indexOf(e) !== i
    );
    const unsortedConnectors = wagmiConnectors.filter(
      (c) =>
        !(
          duplicatedConnectorNames.includes(c.name.toLowerCase()) &&
          isPlaceHolderConnector(c)
        )
    );
    const connectionOrder = (selectedConnections as string[]).map((c) =>
      c.toLowerCase()
    );
    return unsortedConnectors.toSorted((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (!connectionOrder.includes(nameA) || !connectionOrder.includes(nameB))
        return connectionOrder.indexOf(nameB) - connectionOrder.indexOf(nameA);
      return connectionOrder.indexOf(nameA) - connectionOrder.indexOf(nameB);
    });
  }, [wagmiConnectors]);

  return {
    chainId,
    provider,
    connectors,
    isNetworkActive,
    networkError,
    switchNetwork,
  };
};
