"use client";

import { motion } from "framer-motion";
import { Users, Activity, Wallet, Coins, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const stats = [
  { 
    title: "Total Users", 
    value: "2,458", 
    change: "+12.4%", 
    color: "text-green-400",
    icon: <Users className="h-6 w-6 text-primary" />
  },
  { 
    title: "Active Traders", 
    value: "1,892", 
    change: "+8.2%", 
    color: "text-blue-400",
    icon: <Activity className="h-6 w-6 text-primary" />
  },
  { 
    title: "Pending Withdrawals", 
    value: "$142,500", 
    change: "23 requests", 
    color: "text-yellow-400",
    icon: <Wallet className="h-6 w-6 text-primary" />
  },
  { 
    title: "Pending Loans", 
    value: "$892,000", 
    change: "17 requests", 
    color: "text-purple-400",
    icon: <Coins className="h-6 w-6 text-primary" />
  },
];

const recentWithdrawals = [
  { user: "John Doe", amount: "$12,500", date: "2023-12-15", status: "Pending" },
  { user: "Jane Smith", amount: "$8,200", date: "2023-12-14", status: "Approved" },
  { user: "Mike Johnson", amount: "$25,000", date: "2023-12-14", status: "Rejected" },
];

const pendingLoans = [
  { user: "Sarah Wilson", amount: "$50,000", leverage: "1:10", date: "2023-12-15" },
  { user: "Robert Brown", amount: "$75,000", leverage: "1:5", date: "2023-12-14" },
  { user: "Emma Davis", amount: "$100,000", leverage: "1:20", date: "2023-12-13" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-4 md:p-6 -mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Withdrawals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/50 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Withdrawal Requests
          </h3>
          <div className="space-y-4">
            {recentWithdrawals.map((withdrawal, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-accent/10 rounded-lg">
                <div>
                  <p className="font-medium">{withdrawal.user}</p>
                  <p className="text-sm text-muted-foreground">{withdrawal.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{withdrawal.amount}</p>
                  <span className={`text-sm ${
                    withdrawal.status === 'Approved' ? 'text-green-400' :
                    withdrawal.status === 'Rejected' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {withdrawal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Loans */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/50 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Pending Loan Applications
          </h3>
          <div className="space-y-4">
            {pendingLoans.map((loan, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-accent/10 rounded-lg">
                <div>
                  <p className="font-medium">{loan.user}</p>
                  <p className="text-sm text-muted-foreground">Leverage: {loan.leverage}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{loan.amount}</p>
                  <div className="flex gap-2 mt-1">
                    <button className="text-xs px-2 py-1 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20">
                      Approve
                    </button>
                    <button className="text-xs px-2 py-1 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background/50 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
            Add New User
          </button>
          <button className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
            Mass Approve
          </button>
          <button className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
            Generate Reports
          </button>
          <button className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
            System Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}