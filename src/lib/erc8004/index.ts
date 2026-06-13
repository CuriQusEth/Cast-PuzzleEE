// ERC-8004: Trustless Agents Placeholder
// This standard typically defines how frontends interact with smart contract agents 
// built for intent-based execution or autonomous on-chain actions.

export interface AgentIntent {
  action: string;
  maxGasPrice: bigint;
  deadline: number;
}

export function buildAgentPayload(intent: AgentIntent) {
  return {
    isTrustless: true,
    protocol: 'ERC-8004',
    payload: intent
  };
}
