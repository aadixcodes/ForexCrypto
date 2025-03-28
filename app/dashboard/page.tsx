"use client";

import { motion } from "framer-motion";
import TradingViewWidget from "@/components/trading-view-widget";
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  AlertCircle,
  Clock,
  BarChart3,
  History,
  Coins,
  Briefcase
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth }  from "@/app/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

type DashboardData = {
  accountBalance: number;
  baseAccountBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  openPositionsProfitLoss: number;
  closedPositionsProfitLoss: number;
  totalProfitLoss: number;
  totalTrades: number;
  totalVolume: number;
  approvedLoanAmount: number;
  approvedLoanDetails?: {
    amount: number;
    duration: number;
    updatedAt: string;
  } | null;
  recentTransactions: Array<{
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW';
    amount: number;
    timestamp: string;
    status: string;
    verified: boolean;
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
  closedPositions: Array<{
    id: string;
    symbol: string;
    type: string;
    profitLoss: number;
    tradeDate: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
  }>;
};

export default function DashboardPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = async () => {
    if (!userId) return false;

    try {
      setIsRefreshing(true);
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'X-User-Id': userId
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.dashboardData);
        setLastUpdated(new Date());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      return false;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [userId]);

  const handleRefresh = async () => {
    const success = await fetchDashboardData();
    if (success) {
      toast({
        title: "Dashboard Updated",
        description: "Latest data has been loaded.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Could not refresh dashboard data.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const profitLoss = dashboardData?.totalProfitLoss ?? 0;
  const profitLossPercentage = dashboardData?.accountBalance 
    ? ((profitLoss / dashboardData.accountBalance) * 100).toFixed(2) + '%'
    : '0%';

  // Calculate percentage of total for deposits vs withdrawals for visualization
  const totalFinancialActivity = (dashboardData?.totalDeposits || 0) + (dashboardData?.totalWithdrawals || 0);
  const depositPercentage = totalFinancialActivity > 0 
    ? ((dashboardData?.totalDeposits || 0) / totalFinancialActivity) * 100 
    : 0;

  const stats = [
    { 
      title: "Account Balance", 
      value: dashboardData ? `₹${dashboardData.accountBalance.toLocaleString()}` : "₹0", 
      color: "text-green-400",
      icon: <DollarSign className="h-5 w-5 text-primary" />
    },
    { 
      title: "Total Deposits", 
      value: dashboardData ? `₹${dashboardData.totalDeposits.toLocaleString()}` : "₹0", 
      color: "text-green-400",
      icon: <TrendingUp className="h-5 w-5 text-primary" />
    },
    { 
      title: "Total Withdrawals", 
      value: dashboardData ? `₹${dashboardData.totalWithdrawals.toLocaleString()}` : "₹0", 
      color: "text-green-400",
      icon: <ArrowUpRight className="h-5 w-5 text-primary" />
    },
    { 
      title: "Profit/Loss", 
      value: dashboardData ? `₹${dashboardData.totalProfitLoss?.toLocaleString() || "0"}` : "₹0", 
      change: profitLossPercentage,
      color: profitLoss >= 0 ? "text-green-400" : "text-red-400",
      icon: profitLoss >= 0 ? 
        <TrendingUp className="h-5 w-5 text-primary" /> : 
        <TrendingDown className="h-5 w-5 text-primary" />
    },
    ...(dashboardData?.approvedLoanAmount ? [
      {
        title: "Approved Loan", 
        value: `₹${dashboardData.approvedLoanAmount.toLocaleString()}`, 
        color: "text-blue-400",
        icon: <Coins className="h-5 w-5 text-primary" />,
        
      }
    ] : [])
  ];

  // Check if there are any pending transactions
  const hasPendingTransactions = dashboardData?.recentTransactions?.some(
    transaction => transaction.status === 'PENDING'
  );

  // Format the last updated time
  const formattedLastUpdated = lastUpdated 
    ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
    : 'Updating...';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin mr-2">
          <RefreshCw size={24} />
        </div>
        <span>Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 -mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">{formattedLastUpdated}</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/deposit')}
            className="bg-green-500 hover:bg-green-600"
          >
            Deposit
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/withdraw')}
            className="bg-primary hover:bg-primary/90"
          >
            Withdraw
          </Button>
        </div>
      </motion.div>

      {/* Notification for pending transactions */}
      {hasPendingTransactions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-4 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="h-5 w-5" />
          <p>You have pending transactions. These may take some time to process.</p>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  {stat.change && (
                    <span className={`text-sm ${stat.color}`}>{stat.change}</span>
                  )}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs for different dashboard views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Positions
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Trading Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Trades</p>
                  <p className="text-2xl font-semibold mt-2">{dashboardData?.totalTrades || 0}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trading Volume</p>
                  <p className="text-2xl font-semibold mt-2">₹{dashboardData?.totalVolume?.toLocaleString() || 0}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Closed Positions P&L</p>
                  <p className={`text-2xl font-semibold mt-2 ${
                    (dashboardData?.closedPositionsProfitLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ₹{Math.abs(dashboardData?.closedPositionsProfitLoss || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  {(dashboardData?.closedPositionsProfitLoss || 0) >= 0 ? (
                    <ArrowUpRight className="h-6 w-6 text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-6 w-6 text-red-400" />
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Loan Alert for Approved Loans */}
          {dashboardData && dashboardData.approvedLoanAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/10 border border-blue-500/30 text-blue-500 p-4 rounded-lg flex items-center gap-3"
            >
              <Coins className="h-5 w-5" />
              <div>
                <p className="font-medium">Loan Approved</p>
                <p className="text-sm">Your loan request for ₹{dashboardData.approvedLoanAmount.toLocaleString()} has been approved and added to your account balance.</p>
              </div>
            </motion.div>
          )}

          {/* Deposits vs Withdrawals Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Activity</CardTitle>
              <CardDescription>Deposits vs Withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Deposits</span>
                    </div>
                    <span className="text-sm font-medium">
                      ₹{dashboardData?.totalDeposits.toLocaleString() || "0"}
                    </span>
                  </div>
                  <Progress value={depositPercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Withdrawals</span>
                    </div>
                    <span className="text-sm font-medium">
                      ₹{dashboardData?.totalWithdrawals.toLocaleString() || "0"}
                    </span>
                  </div>
                  <Progress value={100 - depositPercentage} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <div className="text-right">
                      <span className={`text-sm ${transaction.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {transaction.status === 'PENDING' ? (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        ) : transaction.status === 'COMPLETED' ? (
                          <span className={`text-green-400 ${transaction.type === 'DEPOSIT' && !transaction.verified ? 'flex items-center gap-1' : ''}`}>
                            {transaction.type === 'DEPOSIT' && !transaction.verified ? (
                              <>
                                <AlertCircle className="h-3 w-3" /> Verification Pending
                              </>
                            ) : 'Completed'}
                          </span>
                        ) : (
                          <span className="text-red-400">Failed</span>
                        )}
                      </p>
                    </div>
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
                        <span>₹{position.buyPrice}</span>
                      </div>
                    </div>
                    <div className={`text-right font-medium ${
                      position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.profitLoss >= 0 ? '+' : '-'}₹{Math.abs(position.profitLoss).toLocaleString()}
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center">No open positions</p>
                )}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your deposits and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentTransactions?.length ? (
                  dashboardData.recentTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex justify-between items-center p-4 border-b last:border-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'DEPOSIT' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <p className="font-medium">{transaction.type}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className={`text-xs ${
                          transaction.status === 'COMPLETED' ? 
                            (transaction.type === 'DEPOSIT' && !transaction.verified ? 'text-yellow-500' : 'text-green-500') : 
                            transaction.status === 'PENDING' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {transaction.status === 'COMPLETED' && transaction.type === 'DEPOSIT' && !transaction.verified ? 
                            'Verification Pending' : transaction.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transaction history available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Trading Positions</CardTitle>
              <CardDescription>Your current open positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.openPositions?.length ? (
                  dashboardData.openPositions.map((position) => (
                    <div 
                      key={position.id} 
                      className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center"
                    >
                      <div className="font-medium">{position.symbol}</div>
                      <div className="text-sm">
                        {position.type === 'LONG' ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" /> Long
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <TrendingDown className="h-4 w-4" /> Short
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          {position.quantity} @ ₹{position.buyPrice}
                        </span>
                      </div>
                      <div className="text-sm">
                        {new Date(position.tradeDate).toLocaleDateString()}
                      </div>
                      <div className={`text-right font-medium ${
                        position.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {position.profitLoss >= 0 ? '+' : '-'}₹{Math.abs(position.profitLoss).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No open positions
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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