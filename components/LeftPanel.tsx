
import React, { useState, useRef } from 'react';
import type { Account, Stakeholder } from '../types';
import { Role } from '../types';
import { ROLE_TEXT_COLORS, ROLE_COLORS } from '../constants';
import { CrownIcon } from './icons';
import { PlusIcon, UserPlusIcon, EditIcon, UploadIcon, DownloadIcon } from './icons';

interface LeftPanelProps {
  accounts: Account[];
  activeAccount: Account | null;
  stakeholders: Stakeholder[];
  onSelectAccount: (id: string) => void;
  onAddAccount: (name: string) => void;
  onAddStakeholder: () => void;
  onEditStakeholder: (stakeholder: Stakeholder) => void;
  onUpdateAccountNotes: (notes: string) => void;
  onExport: () => void;
  onImport: (data: { accounts: Account[], stakeholders: Stakeholder[] }) => void;
  departments: string[];
  selectedDepartment: string | null;
  onSelectDepartment: (dept: string | null) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  accounts,
  activeAccount,
  stakeholders,
  onSelectAccount,
  onAddAccount,
  onAddStakeholder,
  onEditStakeholder,
  onUpdateAccountNotes,
  onExport,
  onImport,
  departments,
  selectedDepartment,
  onSelectDepartment,
}) => {
  const [newAccountName, setNewAccountName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAccount(newAccountName);
    setNewAccountName('');
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const data = JSON.parse(content);
            onImport(data);
          }
        } catch (error) {
          console.error("Failed to parse import file:", error);
          alert("Error: Could not parse the imported file. Please ensure it's a valid JSON export.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className="w-80 lg:w-96 h-full bg-manjaro-surface border-r border-manjaro-border flex flex-col p-4 space-y-4">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-manjaro-mint mb-4">Stakeholder Map</h1>
        
        <div className="flex space-x-2 mb-4">
            <button onClick={onExport} className="flex-1 flex items-center justify-center bg-manjaro-light hover:bg-manjaro-border text-manjaro-text font-semibold text-sm py-1 px-3 rounded-lg transition duration-200">
                <DownloadIcon className="w-4 h-4 mr-2" /> Export
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center bg-manjaro-light hover:bg-manjaro-border text-manjaro-text font-semibold text-sm py-1 px-3 rounded-lg transition duration-200">
                <UploadIcon className="w-4 h-4 mr-2" /> Import
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json"/>
        </div>

        <h2 className="text-sm font-semibold text-manjaro-textAlt mb-2">ACCOUNTS</h2>
        <div className="space-y-2">
            <select
                value={activeAccount?.id || ''}
                onChange={(e) => onSelectAccount(e.target.value)}
                className="w-full p-2 bg-manjaro-light border border-manjaro-border text-manjaro-text rounded-lg focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition"
                disabled={accounts.length === 0}
            >
                <option value="" disabled>Select an account</option>
                {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
            </select>
            <form onSubmit={handleAddAccount} className="flex space-x-2">
                <input
                    type="text"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="New account name..."
                    className="flex-grow p-2 bg-manjaro-light border border-manjaro-border text-manjaro-text placeholder-manjaro-textAlt rounded-lg focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition"
                />
                <button type="submit" className="p-2 bg-manjaro-mint hover:bg-manjaro-mintDark text-white rounded-lg transition">
                    <PlusIcon className="w-5 h-5"/>
                </button>
            </form>
        </div>
      </div>
      
      {activeAccount && (
        <>
          <div className="flex-shrink-0">
            <h2 className="text-sm font-semibold text-manjaro-textAlt mt-4 mb-2">STAKEHOLDERS</h2>
            {departments.length > 0 && (
              <div className="mb-2">
                <label className="block text-xs text-manjaro-textAlt mb-1">Filter by Department</label>
                <select
                  value={selectedDepartment || ''}
                  onChange={(e) => onSelectDepartment(e.target.value || null)}
                  className="w-full p-2 bg-manjaro-light border border-manjaro-border text-manjaro-text rounded-lg focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
            <button onClick={onAddStakeholder} className="w-full flex items-center justify-center bg-manjaro-success hover:bg-manjaro-mint text-white font-semibold py-2 px-4 rounded-xl transition duration-200">
              <UserPlusIcon className="w-5 h-5 mr-2" /> Add Stakeholder
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-1 -mr-2 space-y-2">
            {stakeholders.map(s => (
              <div key={s.id} className="bg-manjaro-light border border-manjaro-border p-3 rounded-xl flex justify-between items-center hover:border-manjaro-mint/50 transition">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-manjaro-text">{s.name}</p>
                    {s.is_department_head && (
                      <span title="Department Head" className="inline-flex items-center text-manjaro-bg bg-manjaro-dept rounded-full px-1 py-0.5 text-[10px] font-bold">
                        <CrownIcon className="w-3 h-3 mr-0.5" /> Head
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-manjaro-textAlt">{s.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {s.department && (
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-manjaro-bg bg-manjaro-dept">{s.department}</span>
                    )}
                    <span className={`text-[10px] font-bold ${ROLE_TEXT_COLORS[s.role]}`}>{s.role}</span>
                  </div>
                </div>
                <button onClick={() => onEditStakeholder(s)} className="p-2 text-manjaro-textAlt hover:text-manjaro-mint hover:bg-manjaro-border rounded-full transition">
                  <EditIcon className="w-4 h-4"/>
                </button>
              </div>
            ))}
            {stakeholders.length === 0 && <p className="text-manjaro-textAlt text-center py-4">No stakeholders added yet.</p>}
          </div>
          
          <div className="flex-shrink-0">
            <h2 className="text-sm font-semibold text-white mb-2">ACCOUNT NOTES</h2>
            <textarea
              value={activeAccount.notes || ''}
              onChange={(e) => onUpdateAccountNotes(e.target.value)}
              placeholder="Add notes about this account..."
              className="w-full h-24 p-2 bg-manjaro-light border border-manjaro-border text-manjaro-text placeholder-manjaro-textAlt rounded-lg resize-none focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition"
            />
          </div>
        </>
      )}
    </aside>
  );
};
