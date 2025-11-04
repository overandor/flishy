// FIX: Import React to provide type definitions for React.FC and React.SVGProps
import type * as React from 'react';

export enum ActionType {
  BORROW = 'BORROW',
  SWAP = 'SWAP',
  REPAY = 'REPAY',
}

export interface Chain {
  id: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Protocol {
  id: string;
  name: string;
  supportedActions: ActionType[];
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ActionStep {
  id: number;
  type: ActionType;
  chain: Chain;
  protocol: Protocol;
  params: {
    tokenA: Token;
    tokenB?: Token;
    amount: number;
  };
}

export interface GeminiAnalysis {
  risks: string[];
  optimizations: string[];
  estimatedProfitUSD: number;
}