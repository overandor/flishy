
import type { Chain, Protocol, Token } from './types';
import { ActionType } from './types';
import { EthereumIcon, PolygonIcon, ArbitrumIcon, AaveIcon, UniswapIcon, SushiSwapIcon, UsdcIcon, WethIcon, DaiIcon, WbtcIcon } from './components/icons';

export const TOKENS: Token[] = [
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', icon: UsdcIcon },
  { id: 'weth', symbol: 'WETH', name: 'Wrapped Ether', icon: WethIcon },
  { id: 'dai', symbol: 'DAI', name: 'Dai Stablecoin', icon: DaiIcon },
  { id: 'wbtc', symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: WbtcIcon },
];

export const CHAINS: Chain[] = [
  { id: 'ethereum', name: 'Ethereum', icon: EthereumIcon },
  { id: 'polygon', name: 'Polygon', icon: PolygonIcon },
  { id: 'arbitrum', name: 'Arbitrum', icon: ArbitrumIcon },
];

const ALL_PROTOCOLS: Protocol[] = [
  { id: 'aave', name: 'Aave', icon: AaveIcon, supportedActions: [ActionType.BORROW, ActionType.REPAY] },
  { id: 'uniswap', name: 'Uniswap', icon: UniswapIcon, supportedActions: [ActionType.SWAP] },
  { id: 'sushiswap', name: 'SushiSwap', icon: SushiSwapIcon, supportedActions: [ActionType.SWAP] },
];

export const PROTOCOLS_BY_CHAIN: Record<string, Protocol[]> = {
  'ethereum': [ALL_PROTOCOLS[0], ALL_PROTOCOLS[1], ALL_PROTOCOLS[2]],
  'polygon': [ALL_PROTOCOLS[0], ALL_PROTOCOLS[1], ALL_PROTOCOLS[2]],
  'arbitrum': [ALL_PROTOCOLS[0], ALL_PROTOCOLS[1]],
};
