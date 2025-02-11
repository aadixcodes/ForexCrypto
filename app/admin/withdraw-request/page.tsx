"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Wallet, Clock, CheckCircle2, XCircle, Banknote, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  user: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  accountDetails: {
    type: string;
    number: string;
  };
}

export default function WithdrawalRequests() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([
    {
      id: "1",
      user: "John Forex",
      amount: 5000,
      method: "Bank Transfer",
      status: "pending",
      date: "2023-12-15",
      accountDetails: {
        type: "Savings Account",
        number: "**** **** 1234"
      }
    },
    {
      id: "2",
      user: "Alice Trader",
      amount: 7500,
      method: "Crypto Wallet",
      status: "pending",
      date: "2023-12-14",
      accountDetails: {
        type: "BTC Wallet",
        number: "bc1qxy2kg...k7n9"
      }
    },
    {
      id: "3",
      user: "Mike Investor",
      amount: 10000,
      method: "PayPal",
      status: "approved",
      date: "2023-12-13",
      accountDetails: {
        type: "Business Account",
        number: "mike@investor.com"
      }
    }
  ]);

  const stats = [
    { title: "Total Requests", value: requests.length, icon: <Wallet className="h-5 w-5" /> },
    { title: "Pending", value: requests.filter(r => r.status === 'pending').length, icon: <Clock className="h-5 w-5" /> },
    { title: "Total Amount", value: `$${requests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`, icon: <Banknote className="h-5 w-5" /> },
    { title: "Completed", value: requests.filter(r => r.status === 'approved').length, icon: <CheckCircle2 className="h-5 w-5" /> }
  ];

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Withdrawal Requests</h1>
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
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background/80 backdrop-blur-lg rounded-xl border shadow-sm"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            Pending Withdrawals
          </h2>

          <div className="space-y-4">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg hover:bg-accent/10 transition-colors"
              >
                <div>
                  <p className="font-medium">{request.user}</p>
                  <p className="text-sm text-muted-foreground">{request.date}</p>
                </div>
                
                <div>
                  <p className="text-lg font-semibold">${request.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{request.method}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="font-medium">{request.accountDetails.type}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-medium">{request.accountDetails.number}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`text-sm ${
                    request.status === 'approved' ? 'text-green-400' :
                    request.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 flex items-center gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}