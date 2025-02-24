"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, Coins, BarChart, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Order } from "@/app/types/orders";
import { useAuth } from "@/app/auth-context";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const { email, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && email) {
      fetchOrders();
    }
  }, [email, authLoading]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show unauthorized message if not logged in
  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">
          Please log in to view your order history
        </div>
      </div>
    );
  }

  // Rest of your existing component code...
  const totalTrades = orders.length;
  const totalVolume = orders.reduce((sum, o) => sum + (o.tradeAmount || 0), 0);
  const netPNL = orders.reduce((sum, o) => {
    if (o.status === 'CLOSED' && o.profitLoss) {
      return sum + o.profitLoss;
    }
    return sum;
  }, 0);

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });
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
            <button 
              onClick={() => setFilter('ALL')}
              className={`hover:text-primary transition-colors ${filter === 'ALL' ? 'text-primary' : ''}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('OPEN')}
              className={`hover:text-primary transition-colors ${filter === 'OPEN' ? 'text-primary' : ''}`}
            >
              Open
            </button>
            <button 
              onClick={() => setFilter('CLOSED')}
              className={`hover:text-primary transition-colors ${filter === 'CLOSED' ? 'text-primary' : ''}`}
            >
              Closed
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
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
                {filteredOrders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className="hover:bg-accent/5 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(order.tradeDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{order.symbol}</td>
                    <td className="p-3 text-right">{order.quantity}</td>
                    <td className="p-3 text-right">${order.buyPrice}</td>
                    <td className="p-3 text-right">{order.sellPrice ? `$${order.sellPrice}` : '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.type === 'LONG' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                      }`}>
                        {order.type}
                      </span>
                    </td>
                    <td className={`p-3 text-right font-medium ${
                      order.profitLoss && order.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <div className="flex items-center justify-end gap-1">
                        {order.profitLoss && order.profitLoss >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        ${Math.abs(order.profitLoss || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'OPEN' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-blue-400/10 text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}