"use client";

import { motion } from "framer-motion";
import TradingViewWidget from "@/components/trading-view-widget";
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth }  from "@/app/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DashboardData = {
  accountBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  profitLoss: number;
  recentTransactions: Array<{
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW';
    amount: number;
    timestamp: string;
    status: string;
  }>;
  openPositions: Array<{
    id: string;
    symbol: string;
    type: string;
    profitLoss: number;
    tradeDate: string;
    quantity: number;
    buyPrice: number;
  }>;
};

export default function DashboardPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) return;

      try {
        const response = await fetch('/api/user/dashboard', {
          headers: {
            'X-User-Id': userId
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.dashboardData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const profitLoss = dashboardData?.profitLoss ?? 0;

  const stats = [
    { 
      title: "Account Balance", 
      value: dashboardData ? `$${dashboardData.accountBalance.toLocaleString()}` : "$0", 
      color: "text-green-400",
      icon: <DollarSign className="h-5 w-5 text-primary" />
    },
    { 
      title: "Total Deposits", 
      value: dashboardData ? `$${dashboardData.totalDeposits.toLocaleString()}` : "$0", 
      color: "text-green-400",
      icon: <TrendingUp className="h-5 w-5 text-primary" />
    },
    { 
      title: "Total Withdrawals", 
      value: dashboardData ? `$${dashboardData.totalWithdrawals.toLocaleString()}` : "$0", 
      color: "text-green-400",
      icon: <ArrowUpRight className="h-5 w-5 text-primary" />
    },
    { 
      title: "Profit/Loss", 
      value: dashboardData ? `$${dashboardData.profitLoss.toLocaleString()}` : "$0", 
      color: profitLoss >= 0 ? "text-green-400" : "text-red-400",
      icon: profitLoss >= 0 ? 
        <TrendingUp className="h-5 w-5 text-primary" /> : 
        <TrendingDown className="h-5 w-5 text-primary" />
    },
  ];

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 -mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => router.push('/deposit')}
            className="bg-green-500 hover:bg-green-600"
          >
            Deposit
          </Button>
          <Button 
            onClick={() => router.push('/withdraw')}
            className="bg-primary hover:bg-primary/90"
          >
            Withdraw
          </Button>
        </div>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/50 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {dashboardData?.recentTransactions?.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 hover:bg-accent/10 rounded-lg">
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm ${transaction.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground text-center">No recent transactions</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background/50 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Open Positions</h3>
          <div className="space-y-4">
            {dashboardData?.openPositions?.map((position) => (
              <div key={position.id} className="flex justify-between items-center p-3 hover:bg-accent/10 rounded-lg">
                <div>
                  <p className="font-medium">{position.symbol}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{position.quantity} units</span>
                    <span>@</span>
                    <span>${position.buyPrice}</span>
                  </div>
                </div>
                <span className={`text-sm ${position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {position.profitLoss >= 0 ? '+' : '-'}${Math.abs(position.profitLoss).toLocaleString()}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground text-center">No open positions</p>
            )}
          </div>
        </motion.div>
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
    </div>
  );
}