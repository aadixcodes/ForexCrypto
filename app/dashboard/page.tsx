"use client";

import { motion } from "framer-motion";
import TradingViewWidget from "@/components/trading-view-widget";
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp} from "lucide-react";

const stats = [
  { 
    title: "Account Balance", 
    value: "$25,000", 
    change: "+2.4%", 
    color: "text-green-400",
    icon: <DollarSign className="h-5 w-5 text-primary" />
  },
  { 
    title: "Overall Gain", 
    value: "$4,200", 
    change: "+15.2%", 
    color: "text-green-400",
    icon: <TrendingUp className="h-5 w-5 text-primary" />
  },
  { 
    title: "Total Profit", 
    value: "$8,450", 
    change: "+32.1%", 
    color: "text-green-400",
    icon: <ArrowUpRight className="h-5 w-5 text-primary" />
  },
  { 
    title: "Total Loss", 
    value: "$1,230", 
    change: "-4.8%", 
    color: "text-red-400",
    icon: <ArrowDownRight className="h-5 w-5 text-primary" />
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 md:p-6 -mt-4">
      {/* Add this heading section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard Overview</h1>
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

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background/50 backdrop-blur-lg rounded-xl border shadow-sm h-[600px]"
      >
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Live Market Chart</h3>
        </div>
        <div className="h-[calc(100%-56px)] p-4">
          <TradingViewWidget />
        </div>
      </motion.div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/50 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {['Deposit', 'Withdrawal', 'Trade'].map((type, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-accent/10 rounded-lg">
                <div>
                  <p className="font-medium">{type} #{idx + 1}</p>
                  <p className="text-sm text-muted-foreground">2023-12-0{idx + 1}</p>
                </div>
                <span className={`text-sm ${idx % 2 ? 'text-green-400' : 'text-red-400'}`}>
                  {idx % 2 ? '+' : '-'}$500
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/50 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Open Positions</h3>
          <div className="space-y-4">
            {['BTC/USD', 'ETH/USD', 'AAPL'].map((pair, idx) => (
              <div key={pair} className="flex justify-between items-center p-3 hover:bg-accent/10 rounded-lg">
                <div>
                  <p className="font-medium">{pair}</p>
                  <p className="text-sm text-muted-foreground">{['Long', 'Short'][idx % 2]}</p>
                </div>
                <span className={`text-sm ${idx % 2 ? 'text-green-400' : 'text-red-400'}`}>
                  {idx % 2 ? '+2.5%' : '-1.2%'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}