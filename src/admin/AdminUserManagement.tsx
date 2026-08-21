import React, { useState } from 'react';
import { Shield, Users, Plus, Key, Lock, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  lastActive: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'usr_admin_01',
    name: 'Soren Vance (Super Admin)',
    email: 'admin@aura.design',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    lastActive: 'Just now'
  },
  {
    id: 'usr_manager_01',
    name: 'Elena Rostova (Store Manager)',
    email: 'manager@aura.design',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    lastActive: '12 minutes ago'
  },
  {
    id: 'usr_support_01',
    name: 'Marcus Thorne (Support Concierge)',
    email: 'support@aura.design',
    role: 'support',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    lastActive: '1 hour ago'
  }
];

const AUDIT_LOGS = [
  { id: 'log_1', action: 'Order AUR-89410 dispatched via FedEx', user: 'Elena Rostova', timestamp: '15 mins ago', type: 'order' },
  { id: 'log_2', action: 'Price updated for "Nomad Cashmere Robe"', user: 'Soren Vance', timestamp: '2 hours ago', type: 'catalog' },
  { id: 'log_3', action: 'Promotional code "ARCHITECT15" published', user: 'Soren Vance', timestamp: '5 hours ago', type: 'marketing' },
  { id: 'log_4', action: 'Review for "Chronograph No. 01" approved', user: 'Marcus Thorne', timestamp: '1 day ago', type: 'moderation' }
];

export const AdminUserManagement: React.FC = () => {
  const { currentUser, switchDemoRole } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('manager');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newMember: TeamMember = {
      id: `usr_${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      lastActive: 'Invited'
    };

    setTeam([...team, newMember]);
    setIsModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Staff Access & Role Permissions (RBAC)
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage administrative privilege tiers, grant access roles, and audit security telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Specialist</span>
        </button>
      </div>

      {/* Role Switcher Demo Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Live Role Simulation Playground</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Switch the active preview session to test RBAC permissions. (e.g. <strong>Support</strong> cannot alter store settings or delete products; <strong>Manager</strong> can fulfill orders & products but cannot manage staff).
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['admin', 'manager', 'support', 'customer'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchDemoRole(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                currentUser?.role === r
                  ? 'bg-zinc-950 text-white'
                  : 'bg-white border border-amber-300 text-amber-950 hover:bg-amber-100'
              }`}
            >
              Test as {r}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-150">
          <h3 className="text-base font-serif font-bold text-zinc-950">
            Active Atelier Personnel
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Access Tier</th>
                <th className="py-3.5 px-4">Last Telemetry</th>
                <th className="py-3.5 px-4 text-right">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-xl object-cover border border-zinc-200"
                      />
                      <span className="font-bold text-zinc-950">{member.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-zinc-600 font-mono text-[11px]">
                    {member.email}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      member.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : member.role === 'manager'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                    }`}>
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-zinc-500">
                    {member.lastActive}
                  </td>

                  <td className="py-3 px-4 text-right text-[11px] text-zinc-500 font-medium">
                    {member.role === 'admin' ? 'Unrestricted Superuser' : member.role === 'manager' ? 'Catalog & Orders' : 'Reviews & Support'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Activity Stream */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-base font-serif font-bold text-zinc-950">
          Security & Operational Audit Logs
        </h3>

        <div className="space-y-3">
          {AUDIT_LOGS.map((log) => (
            <div key={log.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-zinc-900">{log.action}</p>
                <p className="text-[10px] text-zinc-400">Initiated by {log.user}</p>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Grant Staff Access
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean Dupont"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="jean@aura.design"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Role Permission Tier</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
                >
                  <option value="admin">Admin (Full System Control)</option>
                  <option value="manager">Manager (Inventory, Orders & Coupons)</option>
                  <option value="support">Support (Reviews & Customer Care)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl"
                >
                  Send Access Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
