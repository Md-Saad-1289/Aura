import React, { useState, useEffect } from 'react';
import { Shield, Users, Plus, Key, Lock, CheckCircle, X, Edit2, Trash2, ShieldAlert, Activity, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  lastActive: string;
  createdAt: string;
}

const STORAGE_KEY_TEAM = 'aura_store_team_members_v1';

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'usr_admin_01',
    name: 'Soren Vance',
    email: 'admin@aura.design',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    lastActive: 'Active Now',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr_manager_01',
    name: 'Elena Rostova',
    email: 'manager@aura.design',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    lastActive: '12 minutes ago',
    createdAt: '2026-02-15T14:30:00Z'
  },
  {
    id: 'usr_support_01',
    name: 'Marcus Thorne',
    email: 'support@aura.design',
    role: 'support',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    lastActive: '1 hour ago',
    createdAt: '2026-03-01T09:15:00Z'
  }
];

export const AdminUserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { activityLogs, logActivity } = useStore();

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TEAM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TEAM;
      }
    }
    return INITIAL_TEAM;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(team));
  }, [team]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Invite state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('manager');

  // Edit state
  const [editRole, setEditRole] = useState<UserRole>('manager');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const existing = team.find(m => m.email.toLowerCase() === newEmail.trim().toLowerCase());
    if (existing) {
      alert('A specialist with this email address already holds credentials.');
      return;
    }

    const newMember: TeamMember = {
      id: `usr_staff_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newName)}`,
      lastActive: 'Invited (Pending Confirmation)',
      createdAt: new Date().toISOString()
    };

    setTeam(prev => [newMember, ...prev]);
    logActivity('Staff Access Granted', 'auth', `Granted ${newRole} tier privileges to ${newName} (${newEmail})`, newMember.id);
    setIsInviteModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const handleSaveEditRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setTeam(prev =>
      prev.map(m => (m.id === editingMember.id ? { ...m, role: editRole } : m))
    );
    logActivity('Staff Role Updated', 'auth', `Updated ${editingMember.name}'s role to ${editRole}`, editingMember.id);
    setEditingMember(null);
  };

  const handleRevoke = (member: TeamMember) => {
    if (member.role === 'super_admin' && team.filter(m => m.role === 'super_admin').length <= 1) {
      alert('Cannot revoke the primary Super Admin account.');
      return;
    }

    if (confirm(`Revoke staff credentials for ${member.name} (${member.email})?`)) {
      setTeam(prev => prev.filter(m => m.id !== member.id));
      logActivity('Staff Credentials Revoked', 'auth', `Revoked ${member.role} privileges for ${member.name}`, member.id);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'manager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'support':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return 'Unrestricted Superuser & Financial Controls';
      case 'manager':
        return 'Catalog, Orders, Discounts & Fulfillment';
      case 'support':
        return 'Reviews Moderation & Client Inquiries';
      default:
        return 'Standard Client Access';
    }
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
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Specialist</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-150 flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-zinc-950">
            Active Atelier Personnel ({team.length})
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Protected by Role-Based Access Control</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Access Tier</th>
                <th className="py-3.5 px-4">Last Telemetry</th>
                <th className="py-3.5 px-4">Privileges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
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
                      <div>
                        <span className="font-bold text-zinc-950 block">{member.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">ID: {member.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-zinc-600 font-mono text-[11px]">
                    {member.email}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRoleBadge(member.role)}`}>
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-zinc-500">
                    {member.lastActive}
                  </td>

                  <td className="py-3 px-4 text-[11px] text-zinc-600 font-medium">
                    {getRoleDescription(member.role)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingMember(member);
                          setEditRole(member.role);
                        }}
                        className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                        title="Edit Permissions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRevoke(member)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Revoke Staff Credentials"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Activity Stream */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-zinc-950">
              Live Security & Operations Audit Trail
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              System telemetry recorded in real-time across authentication, catalog changes, orders, and privileges.
            </p>
          </div>
          <Activity className="w-4 h-4 text-zinc-400" />
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {activityLogs.length === 0 ? (
            <p className="text-xs text-zinc-400 p-4 bg-zinc-50 rounded-xl border border-zinc-150">
              No audit logs captured in this session yet.
            </p>
          ) : (
            activityLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">{log.action}</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-zinc-200 text-zinc-700 rounded">
                      {log.entityType}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{log.details}</p>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 whitespace-nowrap ml-4">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Grant Staff Access
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
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
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
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
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Role Permission Tier</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold focus:bg-white focus:outline-none"
                >
                  <option value="admin">Admin (Full Operations & Settings)</option>
                  <option value="manager">Manager (Inventory, Orders & Coupons)</option>
                  <option value="support">Support (Reviews & Customer Care)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Send Access Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Modify Role Tier: {editingMember.name}
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRole} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Staff Member Email</label>
                <input
                  type="text"
                  disabled
                  value={editingMember.email}
                  className="w-full bg-zinc-100 border border-zinc-200 rounded-xl p-2.5 text-zinc-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Assigned Privilege Tier</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:bg-white focus:outline-none"
                >
                  <option value="super_admin">Super Admin (Complete Root Control)</option>
                  <option value="admin">Admin (Full System Controls)</option>
                  <option value="manager">Manager (Inventory, Orders & Coupons)</option>
                  <option value="support">Support (Reviews & Customer Care)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white font-bold rounded-xl shadow-xs"
                >
                  Update Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
