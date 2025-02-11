"use client";

import { motion } from "framer-motion";
import { Briefcase, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Coins, BarChart } from "lucide-react";

const orders = [
  { 
    date: "2023-12-01",
    symbol: "BTC/USD",
    quantity: 0.5,
    buyPrice: 42000,
    sellPrice: 43500,
    type: "Long",
    status: "closed"
  },
  { 
    date: "2023-12-02",
    symbol: "ETH/USD",
    quantity: 5,
    buyPrice: 2200,
    sellPrice: 2150,
    type: "Short",
    status: "closed"
  },
  { 
    date: "2023-12-03",
    symbol: "AAPL",
    quantity: 100,
    buyPrice: 192,
    sellPrice: 198,
    type: "Long",
    status: "open"
  },
];

export default function OrdersHistoryPage() {
  const totalTrades = orders.length;
  const totalVolume = orders.reduce((sum, o) => sum + (o.quantity * o.buyPrice), 0);
  const netPNL = orders.reduce((sum, o) => {
    const pnl = (o.sellPrice - o.buyPrice) * o.quantity * (o.type === "Short" ? -1 : 1);
    return o.status === "closed" ? sum + pnl : sum;
  }, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Trading History</h1>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-semibold mt-2">{totalTrades}</p>
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
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-semibold mt-2">${totalVolume.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-400/10">
              <Coins className="h-6 w-6 text-blue-400" />
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
              <p className="text-sm text-muted-foreground">Net P&L</p>
              <p className={`text-2xl font-semibold mt-2 ${netPNL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(netPNL).toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-purple-400/10">
              <BarChart className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-background/80 backdrop-blur-lg rounded-xl border shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Order History
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <button className="hover:text-primary">All</button>
            <button className="hover:text-primary">Open</button>
            <button className="hover:text-primary">Closed</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-muted-foreground border-b">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Symbol</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Buy Price</th>
                <th className="p-3 text-right">Sell Price</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">P&L</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const pnl = (order.sellPrice - order.buyPrice) * order.quantity * (order.type === "Short" ? -1 : 1);
                const isPositive = pnl >= 0;
                
                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className="hover:bg-accent/5 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {order.date}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{order.symbol}</td>
                    <td className="p-3 text-right">{order.quantity}</td>
                    <td className="p-3 text-right">${order.buyPrice}</td>
                    <td className="p-3 text-right">${order.sellPrice}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${order.type === 'Long' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                        {order.type}
                      </span>
                    </td>
                    <td className={`p-3 text-right font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        ${Math.abs(pnl).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'open' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-blue-400/10 text-blue-400'}`}>
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}