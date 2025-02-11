"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Users, UserPlus, UserCheck, UserX, ArrowUpRight, Mail, Shield, BarChart, Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trader' | 'investor';
  status: 'active' | 'suspended' | 'pending';
  registrationDate: string;
  lastLogin: string;
  verified: boolean;
}

export default function TotalUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Forex",
      email: "john@forex.com",
      role: "trader",
      status: "active",
      registrationDate: "2023-11-15",
      lastLogin: "2023-12-15 09:30",
      verified: true
    },
    {
      id: "2",
      name: "Alice Trader",
      email: "alice@trader.com",
      role: "investor",
      status: "active",
      registrationDate: "2023-12-01",
      lastLogin: "2023-12-15 14:45",
      verified: true
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@platform.com",
      role: "admin",
      status: "active",
      registrationDate: "2023-10-01",
      lastLogin: "2023-12-15 16:20",
      verified: true
    }
  ]);

  const stats = [
    { title: "Total Users", value: users.length, icon: <Users className="h-5 w-5" />, change: "+24%", trend: "positive" },
    { title: "New Users", value: "12", icon: <UserPlus className="h-5 w-5" />, change: "+5%", trend: "positive" },
    { title: "Active Users", value: "89%", icon: <UserCheck className="h-5 w-5" />, change: "-2%", trend: "negative" },
    { title: "Suspended", value: "3", icon: <UserX className="h-5 w-5" />, change: "+1", trend: "negative" }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400';
      case 'trader': return 'text-green-400';
      case 'investor': return 'text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <span className={`text-sm ${
                    stat.trend === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User List Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background/80 backdrop-blur-lg rounded-xl border shadow-sm"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Registered Users
            </h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* User Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* User Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`text-sm ${
                      user.status === 'active' ? 'text-green-400' :
                      user.status === 'suspended' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Verified</span>
                    <span className={`text-sm ${
                      user.verified ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {user.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-end gap-2">
                    <button className="text-xs px-2 py-1 rounded-md bg-accent hover:bg-accent/80">
                      View Profile
                    </button>
                    <button className="text-xs px-2 py-1 rounded-md bg-accent hover:bg-accent/80">
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}