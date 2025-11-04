import React, { useState, useEffect } from 'react';
import type { Stakeholder } from '../types';
import { Role } from '../types';
import { TrashIcon } from './icons';

interface StakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stakeholder: Omit<Stakeholder, 'created_at' | 'account_id' | 'x_pos' | 'y_pos'> & { id?: string }) => void;
  onDelete: (id: string) => void;
  stakeholder: Stakeholder | null;
  peers: Stakeholder[];
}

export const StakeholderModal: React.FC<StakeholderModalProps> = ({ isOpen, onClose, onSave, onDelete, stakeholder, peers }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    role: Role.INFLUENCER,
    responsibilities: '',
    notes: '',
    linkedin_url: '',
    connections: [] as string[],
  });

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name,
        title: stakeholder.title,
        role: stakeholder.role,
        responsibilities: stakeholder.responsibilities || '',
        notes: stakeholder.notes || '',
        linkedin_url: stakeholder.linkedin_url || '',
        connections: stakeholder.connections || [],
      });
    } else {
      setFormData({
        name: '',
        title: '',
        role: Role.INFLUENCER,
        responsibilities: '',
        notes: '',
        linkedin_url: '',
        connections: [],
      });
    }
  }, [stakeholder, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required.");
      return;
    }
    onSave({ ...formData, id: stakeholder?.id });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-manjaro-surface rounded-lg shadow-xl w-full max-w-lg p-6 border border-manjaro-border m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">{stakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint" />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint" />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">LinkedIn URL (optional)</label>
            <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://www.linkedin.com/in/username" className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint" />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint">
              {Object.values(Role).map(roleValue => (
                <option key={roleValue} value={roleValue}>{roleValue}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Responsibilities</label>
            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={3} className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 resize-none focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint" />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full bg-manjaro-light border border-manjaro-border rounded-md p-2 resize-none focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint" />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt">Connections (optional)</label>
            <div className="mt-1 max-h-32 overflow-y-auto border border-manjaro-border rounded-md p-2 bg-manjaro-light">
              {peers
                .filter(p => !stakeholder || p.id !== stakeholder.id)
                .map(p => (
                  <label key={p.id} className="flex items-center gap-2 text-sm py-1">
                    <input
                      type="checkbox"
                      className="accent-manjaro-mint"
                      checked={formData.connections.includes(p.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          connections: checked
                            ? Array.from(new Set([...(prev.connections || []), p.id]))
                            : (prev.connections || []).filter(id => id !== p.id)
                        }));
                      }}
                    />
                    <span>{p.name} <span className="text-manjaro-textAlt">({p.title})</span></span>
                  </label>
                ))}
              {peers.filter(p => !stakeholder || p.id !== stakeholder.id).length === 0 && (
                <p className="text-xs text-manjaro-textAlt">No other stakeholders to connect.</p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center pt-4">
            <div>
              {stakeholder && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this stakeholder?')) {
                      onDelete(stakeholder.id);
                    }
                  }}
                  className="flex items-center text-manjaro-error hover:text-red-500 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Delete
                </button>
              )}
            </div>
            <div className="flex space-x-2">
                <button type="button" onClick={onClose} className="bg-manjaro-light hover:bg-manjaro-border text-manjaro-text font-semibold py-2 px-4 rounded-lg transition duration-200">
                  Cancel
                </button>
                <button type="submit" className="bg-manjaro-mint hover:bg-manjaro-mintDark text-manjaro-bg font-bold py-2 px-4 rounded-lg transition duration-200">
                  Save
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
