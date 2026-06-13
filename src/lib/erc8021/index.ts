export function generateAttributionString() {
  const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
  const BUILDER_CODE = "bc_ky56zicb";
  return `attribution:${ATTRIBUTION_CODE}|builder:${BUILDER_CODE}`;
}

export function encodeERC8021Data(originalData?: `0x${string}`) {
  const attribution = generateAttributionString();
  // Basic ERC-8021 attribution hex encoding stub
  // In a real scenario, this would use abi.encode or append to calldata securely
  const hexAttribution = Buffer.from(attribution, 'utf8').toString('hex');
  const baseData = originalData ? originalData.replace('0x', '') : '';
  return `0x${baseData}${hexAttribution}` as `0x${string}`;
}
