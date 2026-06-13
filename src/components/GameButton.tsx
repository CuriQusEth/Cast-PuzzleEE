import { useAccount, useSendTransaction, useConnect, useDisconnect } from 'wagmi';
import { Sun } from 'lucide-react';
import { encodeERC8021Data } from '../lib/erc8021';
import { injected } from 'wagmi/connectors';

export function GameButton() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();

  const sendGMTransaction = () => {
    // We send an empty transaction to the address with the 8021 attribution data
    // Assuming a simple transfer or basic call since no ABI is provided
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      data: encodeERC8021Data(),
      value: 0n,
    });
  };

  if (!isConnected) {
    return (
      <button 
        onClick={() => connect({ connector: injected() })}
        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={sendGMTransaction}
        disabled={isPending}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
      >
        <Sun className="w-4 h-4" />
        {isPending ? 'Sending...' : isSuccess ? 'GM Sent!' : 'Say GM'}
      </button>
      <button 
        onClick={() => disconnect()}
        className="px-2 py-2 rounded-lg text-white/40 hover:text-white/80 transition-colors text-[10px] uppercase tracking-widest font-bold"
      >
        Disconnect
      </button>
    </div>
  );
}
