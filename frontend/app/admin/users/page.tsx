"use client"

import { useAdminStore } from "@/lib/admin-store"
import { useAuth } from "@/components/auth-provider"
import { 
  Users, 
  Search, 
  Trash2, 
  ShieldCheck, 
  ShieldX, 
  MoreHorizontal,
  Mail,
  Calendar,
  UserCheck,
  UserMinus
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserManagement() {
  const { users, deleteUser, toggleUserStatus, verifyUser, grantAdminRole, revokeAdminRole } = useAdminStore()
  const { isSuperAdmin, user: currentUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-white/40 font-medium mt-1">Manage platform users and account permissions.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="text-primary font-bold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{user.name}</p>
                          {user.verified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/30 font-medium">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border ${
                      user.role === "SUPER_ADMIN" 
                        ? "bg-red-500/10 text-red-600 border-red-500/20" 
                        : user.role === "ADMIN"
                        ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest ${
                      user.status === "ACTIVE" 
                        ? "bg-emerald-500/10 text-emerald-600" 
                        : "bg-red-500/10 text-red-600"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/40 font-bold uppercase tracking-tight">
                      <Calendar className="h-3 w-3" />
                      {user.joinedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50" disabled={user.email === currentUser?.email}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#0F0F0F] border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-1">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Account Control</DropdownMenuLabel>
                        {!user.verified && (
                          <DropdownMenuItem onClick={() => verifyUser(user.id)} className="gap-2 text-xs font-bold rounded-lg px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary">
                            <UserCheck className="h-4 w-4" /> Verify User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)} className="gap-2 text-xs font-bold rounded-lg px-3 py-2 cursor-pointer focus:bg-orange-500/10 focus:text-orange-600">
                          {user.status === "ACTIVE" ? (
                            <>
                              <UserMinus className="h-4 w-4" /> Suspend Account
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" /> Activate Account
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        {isSuperAdmin && user.role !== "SUPER_ADMIN" && (
                          <>
                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mx-1" />
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Role Management</DropdownMenuLabel>
                            {user.role === "USER" ? (
                              <DropdownMenuItem onClick={() => grantAdminRole(user.id)} className="gap-2 text-xs font-bold rounded-lg px-3 py-2 cursor-pointer focus:bg-blue-500/10 focus:text-blue-600">
                                <ShieldCheck className="h-4 w-4" /> Grant Admin Role
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => revokeAdminRole(user.id)} className="gap-2 text-xs font-bold rounded-lg px-3 py-2 cursor-pointer focus:bg-red-500/10 focus:text-red-600">
                                <ShieldX className="h-4 w-4" /> Revoke Admin Role
                              </DropdownMenuItem>
                            )}
                          </>
                        )}

                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mx-1" />
                        <DropdownMenuItem onClick={() => deleteUser(user.id)} className="gap-2 text-xs font-bold rounded-lg px-3 py-2 cursor-pointer focus:bg-red-500/10 text-red-600 focus:text-red-500">
                          <Trash2 className="h-4 w-4" /> Delete Person
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <Users className="h-12 w-12 text-slate-200 dark:text-white/5 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-white/40 font-bold">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
