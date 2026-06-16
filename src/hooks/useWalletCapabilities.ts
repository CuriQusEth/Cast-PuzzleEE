import { useCapabilities, useChainId } from 'wagmi';
import { useMemo } from 'react';

export function useWalletCapabilities() {
  const chainId = useChainId();
  const { data: capabilities } = useCapabilities();

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[chainId]?.atomic;
    return atomic?.status === 'ready' || atomic?.status === 'supported';
  }, [capabilities, chainId]);

  return { supportsBatching };
}
