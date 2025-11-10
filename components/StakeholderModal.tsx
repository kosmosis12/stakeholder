
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
}

export const StakeholderModal: React.FC<StakeholderModalProps> = ({ isOpen, onClose, onSave, onDelete, stakeholder }) => {
  const [deptOptions, setDeptOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    role: Role.INFLUENCER,
    responsibilities: '',
    notes: '',
    department: '',
    is_department_head: false,
  });

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name,
        title: stakeholder.title,
        role: stakeholder.role,
        responsibilities: stakeholder.responsibilities || '',
        notes: stakeholder.notes || '',
        department: stakeholder.department || '',
        is_department_head: !!stakeholder.is_department_head,
      });
    } else {
      setFormData({
        name: '',
        title: '',
        role: Role.INFLUENCER,
        responsibilities: '',
        notes: '',
        department: '',
        is_department_head: false,
      });
    }
  }, [stakeholder, isOpen]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('stakeholders');
      if (raw) {
        const arr = JSON.parse(raw) as Array<{ department?: string }>;
        const set = new Set<string>();
        for (const s of arr) {
          if (s && s.department && s.department.trim()) set.add(s.department.trim());
        }
        setDeptOptions(Array.from(set).sort());
      } else {
        setDeptOptions([]);
      }
    } catch (_) {
      setDeptOptions([]);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-manjaro-surface rounded-2xl shadow-glow w-full max-w-lg p-6 border border-manjaro-border m-4 animate-fadeIn" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-manjaro-mint">{stakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border text-manjaro-text placeholder-manjaro-textAlt rounded-lg p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition" 
            />
        </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              list="department-list"
              placeholder="e.g., Product, Engineering, Customer Success"
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border text-manjaro-text placeholder-manjaro-textAlt rounded-lg p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition"
            />
            <datalist id="department-list">
              {deptOptions.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="is_department_head"
                type="checkbox"
                name="is_department_head"
                checked={formData.is_department_head}
                onChange={handleCheckbox}
                className="accent-manjaro-warn"
              />
              <label htmlFor="is_department_head" className="text-sm text-manjaro-textAlt">Department Head</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt mb-1">Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border text-manjaro-text placeholder-manjaro-textAlt rounded-lg p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt mb-1">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border text-manjaro-text rounded-lg p-2 focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition"
            >
              {Object.values(Role).map(roleValue => (
                <option key={roleValue} value={roleValue}>{roleValue}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt mb-1">Responsibilities</label>
            <textarea 
              name="responsibilities" 
              value={formData.responsibilities} 
              onChange={handleChange} 
              rows={3} 
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border text-manjaro-text placeholder-manjaro-textAlt rounded-lg p-2 resize-none focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-manjaro-textAlt mb-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              rows={3} 
              className="mt-1 block w-full bg-manjaro-light border border-manjaro-border text-manjaro-text placeholder-manjaro-textAlt rounded-lg p-2 resize-none focus:ring-2 focus:ring-manjaro-mint focus:border-manjaro-mint transition" 
            />
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
                  className="flex items-center text-manjaro-error hover:text-red-400 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Delete
                </button>
              )}
            </div>
            <div className="flex space-x-2">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="bg-manjaro-light hover:bg-manjaro-border text-manjaro-text font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-manjaro-mint hover:bg-manjaro-mintDark text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Save
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
