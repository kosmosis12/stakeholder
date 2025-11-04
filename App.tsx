import React, { useState, useCallback, useEffect } from 'react';
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
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
  
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeAccount = accounts.find(acc => acc.id === activeAccountId) ?? null;

  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-dark', 'theme-light');
    body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  }, [theme]);

  const handleAddAccount = (name: string, company_url?: string) => {
    if (!name.trim()) return;
    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      name,
      notes: '',
      company_url,
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
  const handleEditAccount = (id: string, name: string, company_url?: string) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, name, company_url } : acc));
  };
  
  const handleDeleteAccount = (id: string) => {
    const remaining = accounts.filter(a => a.id !== id);
    setAccounts(remaining);
    setStakeholders(stakeholders.filter(s => s.account_id !== id));
    if (activeAccountId === id) {
      setActiveAccountId(remaining[0]?.id ?? null);
    }
  };
  
  const handleUpdateStakeholderPosition = useCallback((id: string, x: number, y: number) => {
    setStakeholders(prev => 
      prev.map(s => s.id === id ? { ...s, x_pos: x, y_pos: y } : s)
    );
  }, [setStakeholders]);

  const handleConnectStakeholders = useCallback((aId: string, bId: string) => {
    setStakeholders(prev => {
      const a = prev.find(s => s.id === aId);
      const b = prev.find(s => s.id === bId);
      if (!a || !b) return prev;
      if (a.account_id !== b.account_id) return prev; // only connect within same account
      const updated = prev.map(s => {
        if (s.id === aId) {
          const setConns = new Set(s.connections || []);
          setConns.add(bId);
          return { ...s, connections: Array.from(setConns) };
        }
        if (s.id === bId) {
          const setConns = new Set(s.connections || []);
          setConns.add(aId);
          return { ...s, connections: Array.from(setConns) };
        }
        return s;
      });
      return updated;
    });
  }, []);

  const handleSaveStakeholder = (stakeholder: Omit<Stakeholder, 'id' | 'created_at' | 'account_id'> & { id?: string }) => {
    if (!activeAccountId) return;
    const accountStakeholders = stakeholders.filter(s => s.account_id === activeAccountId);
    if (stakeholder.id) {
      // Editing existing
      const updated = stakeholders.map(s => s.id === stakeholder.id ? { ...s, ...stakeholder } as Stakeholder : s);
      // Sync connections bidirectionally within the account
      const edited = updated.find(s => s.id === stakeholder.id)!;
      const newConns = new Set(edited.connections || []);
      const result = updated.map(s => {
        if (s.account_id !== activeAccountId || s.id === edited.id) return s;
        const hasConn = newConns.has(s.id);
        const sConns = new Set(s.connections || []);
        if (hasConn) {
          sConns.add(edited.id);
        } else {
          sConns.delete(edited.id);
        }
        return { ...s, connections: Array.from(sConns) };
      });
      setStakeholders(result);
    } else {
      // Creating new
      const newId = `sh_${Date.now()}`;
      const newStakeholder: Stakeholder = {
        ...stakeholder,
        id: newId,
        created_at: new Date().toISOString(),
        account_id: activeAccountId,
        x_pos: 50,
        y_pos: 50,
      } as Stakeholder;
      const newConns = new Set((newStakeholder.connections || []).filter(id => accountStakeholders.some(s => s.id === id)));
      // Add reverse links to peers in same account
      const updatedPeers = stakeholders.map(s => {
        if (s.account_id !== activeAccountId) return s;
        if (newConns.has(s.id)) {
          const sConns = new Set(s.connections || []);
          sConns.add(newId);
          return { ...s, connections: Array.from(sConns) };
        }
        return s;
      });
      setStakeholders([...updatedPeers, newStakeholder]);
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
        onEditAccount={handleEditAccount}
        onAddStakeholder={() => openStakeholderModal(null)}
        onEditStakeholder={openStakeholderModal}
        onUpdateAccountNotes={handleUpdateAccountNotes}
        onDeleteAccount={handleDeleteAccount}
        onExport={exportData}
        onImport={importData}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <main className="flex-1 flex flex-col relative">
        {activeAccount ? (
          <Canvas
            stakeholders={stakeholders.filter(s => s.account_id === activeAccountId)}
            onUpdateStakeholderPosition={handleUpdateStakeholderPosition}
            onEditStakeholder={openStakeholderModal}
            onConnectStakeholders={handleConnectStakeholders}
            activeAccountName={activeAccount?.name || ''}
            theme={theme}
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
          peers={stakeholders.filter(s => s.account_id === activeAccountId)}
        />
      )}
    </div>
  );
}
