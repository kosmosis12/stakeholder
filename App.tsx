import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LeftPanel } from './components/LeftPanel';
import { Canvas } from './components/Canvas';
import { StakeholderModal } from './components/StakeholderModal';
import type { Account, Stakeholder } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';

export default function App() {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);
  const [stakeholders, setStakeholders] = useLocalStorage<Stakeholder[]>('stakeholders', []);
  const [activeAccountId, setActiveAccountId] = useLocalStorage<string | null>('activeAccountId', null);
  
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeAccount = accounts.find(acc => acc.id === activeAccountId) ?? null;

  const handleAddAccount = (name: string) => {
    if (!name.trim()) return;
    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      name,
      notes: '',
      created_at: new Date().toISOString(),
    };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    setActiveAccountId(newAccount.id);
  };

  const handleUpdateAccountNotes = (notes: string) => {
    if (!activeAccount) return;
    setAccounts(accounts.map(acc => acc.id === activeAccountId ? { ...acc, notes } : acc));
  };
  
  const handleUpdateStakeholderPosition = useCallback((id: string, x: number, y: number) => {
    setStakeholders(prev => 
      prev.map(s => s.id === id ? { ...s, x_pos: x, y_pos: y } : s)
    );
  }, [setStakeholders]);

  const handleSaveStakeholder = (stakeholder: Omit<Stakeholder, 'id' | 'created_at' | 'account_id'> & { id?: string }) => {
    if (!activeAccountId) return;
    if (stakeholder.id) { // Editing existing
      setStakeholders(stakeholders.map(s => s.id === stakeholder.id ? { ...s, ...stakeholder } : s));
    } else { // Creating new
      const newStakeholder: Stakeholder = {
        ...stakeholder,
        id: `sh_${Date.now()}`,
        created_at: new Date().toISOString(),
        account_id: activeAccountId,
        x_pos: 50,
        y_pos: 50,
      };
      setStakeholders([...stakeholders, newStakeholder]);
    }
    setIsModalOpen(false);
    setEditingStakeholder(null);
  };

  const handleDeleteStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
    setIsModalOpen(false);
    setEditingStakeholder(null);
  };

  const openStakeholderModal = (stakeholder: Stakeholder | null) => {
    setEditingStakeholder(stakeholder);
    setIsModalOpen(true);
  };

  const importData = (data: { accounts: Account[], stakeholders: Stakeholder[] }) => {
    if (data.accounts && data.stakeholders) {
      setAccounts(data.accounts);
      setStakeholders(data.stakeholders);
      setActiveAccountId(data.accounts[0]?.id || null);
      alert('Data imported successfully!');
    } else {
      alert('Invalid import file format.');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ accounts, stakeholders }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'stakeholder_map_data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="flex h-screen w-screen font-sans bg-manjaro-bg text-manjaro-text overflow-hidden">
      <LeftPanel
        accounts={accounts}
        activeAccount={activeAccount}
        stakeholders={stakeholders.filter(s => s.account_id === activeAccountId)}
        onSelectAccount={setActiveAccountId}
        onAddAccount={handleAddAccount}
        onAddStakeholder={() => openStakeholderModal(null)}
        onEditStakeholder={openStakeholderModal}
        onUpdateAccountNotes={handleUpdateAccountNotes}
        onExport={exportData}
        onImport={importData}
      />
      <main className="flex-1 flex flex-col relative">
        {activeAccount ? (
          <Canvas
            stakeholders={stakeholders.filter(s => s.account_id === activeAccountId)}
            onUpdateStakeholderPosition={handleUpdateStakeholderPosition}
            onEditStakeholder={openStakeholderModal}
          />
        ) : (
          <WelcomeScreen onAddAccount={() => {
            const newName = prompt("Enter new account name:");
            if (newName) handleAddAccount(newName);
          }} />
        )}
      </main>
      {isModalOpen && activeAccount && (
        <StakeholderModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStakeholder(null);
          }}
          onSave={handleSaveStakeholder}
          onDelete={handleDeleteStakeholder}
          stakeholder={editingStakeholder}
        />
      )}
    </div>
  );
}