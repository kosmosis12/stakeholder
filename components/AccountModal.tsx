import React, { useEffect, useState } from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, company_url?: string) => void;
  title?: string;
  initialName?: string;
  initialUrl?: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, title, initialName, initialUrl }) => {
  const [name, setName] = useState(initialName || '');
  const [companyUrl, setCompanyUrl] = useState(initialUrl || '');

  useEffect(() => {
    if (isOpen) {
      setName(initialName || '');
      setCompanyUrl(initialUrl || '');
    } else {
      setName('');
      setCompanyUrl('');
    }
  }, [isOpen, initialName, initialUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Account Name is required.');
      return;
    }
    onSave(name.trim(), companyUrl.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-manjaro-surface rounded-lg shadow-xl w-full max-w-lg p-6 border border-manjaro-border m-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">{title || 'Add New Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Account Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Company URL (optional)</label>
            <input
              type="url"
              value={companyUrl}
              placeholder="https://example.com"
              onChange={(e) => setCompanyUrl(e.target.value)}
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="bg-manjaro-light hover:bg-manjaro-border text-manjaro-text font-semibold py-2 px-4 rounded-lg transition duration-200">
              Cancel
            </button>
            <button type="submit" className="bg-manjaro-mint hover:bg-manjaro-mintDark text-manjaro-bg font-bold py-2 px-4 rounded-lg transition duration-200">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
