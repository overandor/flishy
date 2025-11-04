
import React, { useState, useMemo } from 'react';
import type { ActionStep, Chain, Protocol, Token } from '../types';
import { ActionType } from '../types';
import { CHAINS, PROTOCOLS_BY_CHAIN, TOKENS } from '../constants';

interface AddActionModalProps {
  onClose: () => void;
  onSave: (step: Omit<ActionStep, 'id'>) => void;
}

const SelectButton: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({ selected, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
            selected ? 'bg-cyan-500/20 border-cyan-500' : 'bg-gray-700 border-gray-600 hover:border-gray-500'
        }`}
    >
        {children}
    </button>
);

export const AddActionModal: React.FC<AddActionModalProps> = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<ActionType | null>(null);
  const [chain, setChain] = useState<Chain | null>(null);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [amount, setAmount] = useState<number>(100000);
  const [tokenA, setTokenA] = useState<Token | null>(TOKENS[0]);
  const [tokenB, setTokenB] = useState<Token | null>(TOKENS[1]);

  const availableProtocols = useMemo(() => {
    if (!chain || !type) return [];
    return PROTOCOLS_BY_CHAIN[chain.id].filter(p => p.supportedActions.includes(type));
  }, [chain, type]);

  const handleSave = () => {
    if (type && chain && protocol && tokenA) {
      onSave({ type, chain, protocol, params: { amount, tokenA, tokenB: type === ActionType.SWAP ? tokenB : undefined }});
    }
  };

  const isValid = type && chain && protocol && amount > 0 && tokenA && (type !== ActionType.SWAP || tokenB);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl text-white transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Add New Action</h2>
        </div>
        <div className="p-6 space-y-6">
            {/* Step 1: Action Type */}
            <section>
                <h3 className="font-semibold mb-3 text-cyan-300">1. Select Action Type</h3>
                <div className="grid grid-cols-3 gap-4">
                    {Object.values(ActionType).map(t => (
                        <SelectButton key={t} selected={type === t} onClick={() => setType(t)}>
                            {t.charAt(0) + t.slice(1).toLowerCase()}
                        </SelectButton>
                    ))}
                </div>
            </section>
            
            {/* Step 2: Chain */}
            {type && (
                <section>
                    <h3 className="font-semibold mb-3 text-cyan-300">2. Select Chain</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {CHAINS.map(c => (
                            <SelectButton key={c.id} selected={chain?.id === c.id} onClick={() => { setChain(c); setProtocol(null); }}>
                                <div className="flex items-center space-x-2"><c.icon className="w-5 h-5"/><span>{c.name}</span></div>
                            </SelectButton>
                        ))}
                    </div>
                </section>
            )}

            {/* Step 3: Protocol */}
            {chain && (
                 <section>
                    <h3 className="font-semibold mb-3 text-cyan-300">3. Select Protocol</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {availableProtocols.map(p => (
                            <SelectButton key={p.id} selected={protocol?.id === p.id} onClick={() => setProtocol(p)}>
                               <div className="flex items-center space-x-2"><p.icon className="w-5 h-5"/><span>{p.name}</span></div>
                            </SelectButton>
                        ))}
                    </div>
                </section>
            )}

            {/* Step 4: Parameters */}
            {protocol && (
                <section>
                    <h3 className="font-semibold mb-3 text-cyan-300">4. Configure Parameters</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-lg">
                        <div>
                            <label className="text-sm text-gray-400">Amount</label>
                            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:ring-cyan-500 focus:border-cyan-500 font-roboto-mono" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">{type === ActionType.SWAP ? "From Token" : "Token"}</label>
                            <select onChange={e => setTokenA(TOKENS.find(t => t.id === e.target.value) || null)} value={tokenA?.id} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:ring-cyan-500 focus:border-cyan-500">
                                {TOKENS.map(t => <option key={t.id} value={t.id}>{t.symbol}</option>)}
                            </select>
                        </div>
                        {type === ActionType.SWAP && (
                            <div className="col-span-2">
                                <label className="text-sm text-gray-400">To Token</label>
                                <select onChange={e => setTokenB(TOKENS.find(t => t.id === e.target.value) || null)} value={tokenB?.id} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:ring-cyan-500 focus:border-cyan-500">
                                {TOKENS.filter(t => t.id !== tokenA?.id).map(t => <option key={t.id} value={t.id}>{t.symbol}</option>)}
                            </select>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
        <div className="p-6 bg-gray-900/50 flex justify-end space-x-4 rounded-b-xl">
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!isValid} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md font-semibold transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed">Save Action</button>
        </div>
      </div>
    </div>
  );
};
