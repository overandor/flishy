
import React from 'react';
import type { ActionStep } from '../types';
import { ActionType } from '../types';
import { ArrowRightIcon, TrashIcon } from './icons';

interface ActionCardProps {
  step: ActionStep;
  index: number;
  onRemove: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

const ActionLabel: React.FC<{ type: ActionType }> = ({ type }) => {
    const typeStyles: Record<ActionType, string> = {
        [ActionType.BORROW]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        [ActionType.SWAP]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        [ActionType.REPAY]: 'bg-green-500/20 text-green-300 border-green-500/30',
    };
    return <span className={`px-2 py-1 text-xs font-bold rounded-md border ${typeStyles[type]}`}>{type}</span>
}

const TokenDisplay: React.FC<{token: ActionStep['params']['tokenA']}> = ({token}) => (
    <div className="flex items-center space-x-2">
        <token.icon className="w-5 h-5"/>
        <span className="font-roboto-mono">{token.symbol}</span>
    </div>
);


export const ActionCard: React.FC<ActionCardProps> = ({ step, index, onRemove }) => {
  const { type, chain, protocol, params } = step;

  const renderParams = () => {
    switch(type) {
      case ActionType.BORROW:
        return (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold font-roboto-mono">{params.amount.toLocaleString()}</span>
            <TokenDisplay token={params.tokenA} />
          </div>
        );
      case ActionType.SWAP:
        return (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold font-roboto-mono">{params.amount.toLocaleString()}</span>
              <TokenDisplay token={params.tokenA} />
            </div>
            <ArrowRightIcon className="w-5 h-5 text-gray-400" />
            {params.tokenB && <TokenDisplay token={params.tokenB} />}
          </div>
        );
      case ActionType.REPAY:
        return (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Loan of</span>
            <TokenDisplay token={params.tokenA} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="group bg-gray-800/70 border border-gray-700/80 rounded-lg p-4 flex items-center justify-between transition-shadow duration-200 hover:shadow-lg hover:border-gray-600">
        <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-500">{index + 1}</div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <ActionLabel type={type} />
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <protocol.icon className="w-5 h-5"/>
                        <span>{protocol.name}</span>
                        <span className="text-gray-600">/</span>
                        <chain.icon className="w-5 h-5"/>
                        <span>{chain.name}</span>
                    </div>
                </div>
                {renderParams()}
            </div>
        </div>
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity duration-200">
            <TrashIcon className="w-5 h-5" />
        </button>
    </div>
  );
};
