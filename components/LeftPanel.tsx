import React, { useState, useRef } from 'react';
import type { Account, Stakeholder } from '../types';
import { Role } from '../types';
import { ROLE_TEXT_COLORS } from '../constants';
import { PlusIcon, UserPlusIcon, EditIcon, UploadIcon, DownloadIcon, SunIcon, MoonIcon, TrashIcon } from './icons';
import { AccountModal } from './AccountModal';

interface LeftPanelProps {
  accounts: Account[];
  activeAccount: Account | null;
  stakeholders: Stakeholder[];
  onSelectAccount: (id: string) => void;
  onAddAccount: (name: string, company_url?: string) => void;
  onEditAccount: (id: string, name: string, company_url?: string) => void;
  onAddStakeholder: () => void;
  onEditStakeholder: (stakeholder: Stakeholder) => void;
  onUpdateAccountNotes: (notes: string) => void;
  onDeleteAccount: (id: string) => void;
  onExport: () => void;
  onImport: (data: { accounts: Account[], stakeholders: Stakeholder[] }) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  accounts,
  activeAccount,
  stakeholders,
  onSelectAccount,
  onAddAccount,
  onEditAccount,
  onAddStakeholder,
  onEditStakeholder,
  onUpdateAccountNotes,
  onDeleteAccount,
  onExport,
  onImport,
  theme,
  onToggleTheme,
}) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAccountCreate = (name: string, url?: string) => {
    onAddAccount(name, url);
    setIsAccountModalOpen(false);
  };

  const handleAccountEditSave = (name: string, url?: string) => {
    if (!activeAccount) return;
    onEditAccount(activeAccount.id, name, url);
    setIsEditAccountModalOpen(false);
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
    <aside className="w-64 h-full bg-manjaro-surface border-r border-manjaro-border flex flex-col p-4 space-y-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="brand-font text-2xl font-extrabold tracking-wide text-manjaro-text">STAKEHOLDER</h1>
          <button
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-md border border-manjaro-border text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border"
          >
            {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex space-x-2 mb-4">
            <button onClick={onExport} className="flex-1 flex items-center justify-center bg-manjaro-light hover:bg-manjaro-border text-manjaro-text font-semibold py-2 px-4 rounded-lg transition duration-200">
                <DownloadIcon className="w-5 h-5 mr-2" /> Export
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center bg-manjaro-light hover:bg-manjaro-border text-manjaro-text font-semibold py-2 px-4 rounded-lg transition duration-200">
                <UploadIcon className="w-5 h-5 mr-2" /> Import
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json"/>
        </div>

        <h2 className="text-sm font-bold text-manjaro-mint mb-2 uppercase tracking-wider">ACCOUNTS</h2>
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <select
                  value={activeAccount?.id || ''}
                  onChange={(e) => onSelectAccount(e.target.value)}
                  className="flex-1 p-2 bg-manjaro-light border border-manjaro-border rounded-md focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint"
                  disabled={accounts.length === 0}
              >
                  <option value="" disabled>Select an account</option>
                  {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
              </select>
              <button
                type="button"
                disabled={!activeAccount}
                onClick={() => setIsEditAccountModalOpen(true)}
                className="p-2 text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                title="Edit this account"
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!activeAccount}
                onClick={() => {
                  if (!activeAccount) return;
                  if (window.confirm(`Delete account \"${activeAccount.name}\" and all its stakeholders?`)) {
                    onDeleteAccount(activeAccount.id);
                  }
                }}
                className="p-2 text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                title="Delete this account"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-manjaro-mint hover:bg-manjaro-mintDark text-manjaro-bg font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              <PlusIcon className="w-4 h-4" /> Add New Account
            </button>
        </div>
      </div>
      
      {activeAccount && (
        <>
          <div className="flex-shrink-0">
            <h2 className="text-sm font-bold text-manjaro-mint mt-4 mb-2 uppercase tracking-wider">STAKEHOLDERS</h2>
            <button onClick={onAddStakeholder} className="w-full flex items-center justify-center bg-manjaro-mint hover:bg-manjaro-mintDark text-manjaro-bg font-bold py-2 px-4 rounded-lg transition duration-200">
              <UserPlusIcon className="w-5 h-5 mr-2" /> Add Stakeholder
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-1 -mr-2 space-y-2">
            {stakeholders.map(s => (
              <div key={s.id} className="bg-manjaro-light p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-manjaro-text">{s.name}</p>
                  <p className="text-xs text-manjaro-textAlt">{s.title}</p>
                  <p className={`text-xs font-bold ${ROLE_TEXT_COLORS[s.role]}`}>{s.role}</p>
                </div>
                <button onClick={() => onEditStakeholder(s)} className="p-2 text-manjaro-textAlt hover:text-manjaro-text hover:bg-manjaro-border rounded-full">
                  <EditIcon className="w-4 h-4"/>
                </button>
              </div>
            ))}
            {stakeholders.length === 0 && <p className="text-manjaro-textAlt opacity-75 text-center py-4">No stakeholders added yet.</p>}
          </div>
          
          <div className="flex-shrink-0">
            <h2 className="text-sm font-bold text-manjaro-mint mb-2 uppercase tracking-wider">ACCOUNT NOTES</h2>
            {activeAccount.company_url && (
              <p className="mb-2 text-xs">
                <a className="text-manjaro-info hover:underline" href={activeAccount.company_url} target="_blank" rel="noreferrer">{activeAccount.company_url}</a>
              </p>
            )}
            <textarea
              value={activeAccount.notes || ''}
              onChange={(e) => onUpdateAccountNotes(e.target.value)}
              placeholder="Add notes about this account..."
              className="w-full h-24 p-2 bg-manjaro-light border border-manjaro-border rounded-md resize-none focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint placeholder:text-manjaro-textAlt"
            />
            
          </div>
        </>
      )}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSave={handleAccountCreate}
        title="Add New Account"
      />
      <AccountModal
        isOpen={isEditAccountModalOpen}
        onClose={() => setIsEditAccountModalOpen(false)}
        onSave={handleAccountEditSave}
        title="Edit Account"
        initialName={activeAccount?.name}
        initialUrl={activeAccount?.company_url}
      />
    </aside>
  );
};
