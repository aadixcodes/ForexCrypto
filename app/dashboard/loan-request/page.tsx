"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { Coins, BarChart, Clock, Wallet, CheckCircle } from "lucide-react";

export default function LoanRequestPage() {
  const [amount, setAmount] = useState<string>("");
  const [leverage, setLeverage] = useState<string>("50");
  const [currencyPair, setCurrencyPair] = useState<string>("EUR/USD");
  const [purpose, setPurpose] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Add loan processing logic here
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Margin Loan Request</h1>
      </motion.div>

      {!isSubmitted ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loan Details Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Loan Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Loan Amount (USD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-background border rounded-lg py-2 px-4 pr-12 focus:ring-2 focus:ring-primary"
                      placeholder="Enter amount"
                      min="1000"
                      required
                    />
                    <span className="absolute right-4 top-2.5 text-muted-foreground">$</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Leverage Ratio
                  </label>
                  <select
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="w-full bg-background border rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary"
                  >
                    {['10', '20', '30', '50', '100'].map((ratio) => (
                      <option key={ratio} value={ratio}>1:{ratio}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Trading Parameters */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Trading Parameters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Currency Pair
                  </label>
                  <select
                    value={currencyPair}
                    onChange={(e) => setCurrencyPair(e.target.value)}
                    className="w-full bg-background border rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary"
                  >
                    {['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD'].map((pair) => (
                      <option key={pair} value={pair}>{pair}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Maximum Exposure
                  </label>
                  <div className="bg-accent/10 p-3 rounded-lg text-sm">
                    ${(Number(amount) * Number(leverage)).toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </div>

            {/* Repayment Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Repayment Terms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Loan Purpose
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-background border rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary"
                    placeholder="Short-term position, Hedge, etc."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Repayment Method
                  </label>
                  <select
                    className="w-full bg-background border rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary"
                  >
                    <option>Automatic from trading account</option>
                    <option>Manual repayment</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm text-muted-foreground mb-2">
                  Loan Duration (Months)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    className="w-full"
                  />
                  <span className="text-sm">3 Months</span>
                </div>
              </div>
            </div>

            {/* Risk Disclosure */}
            <div className="bg-red-400/10 p-4 rounded-lg text-sm text-red-300">
              <p>⚠️ Margin trading involves significant risk. You may lose more than your initial investment.</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
              >
                Request Margin Loan
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background/80 backdrop-blur-lg rounded-xl border p-8 shadow-sm max-w-md mx-auto text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loan Request Received</h2>
          <p className="text-muted-foreground mb-4">
            Your margin loan request for ${amount} is under review.
            We'll contact you within 24 hours.
          </p>
          <button
            onClick={() => {
              setAmount("");
              setLeverage("50");
              setCurrencyPair("EUR/USD");
              setPurpose("");
              setIsSubmitted(false);
            }}
            className="text-primary hover:text-primary/80 font-medium"
          >
            New Loan Request
          </button>
        </motion.div>
      )}
    </div>
  );
}