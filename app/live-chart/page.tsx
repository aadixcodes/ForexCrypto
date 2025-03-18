"use client";

import { motion } from "framer-motion";
import TradingViewWidget from "@/components/trading-view-widget";
import { DollarSign, Activity, Timer, BarChart, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";


export default function ChartsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6 -mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6 h-10"></h1>
      </motion.div>

      {/* Main Chart Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-background/80 backdrop-blur-lg rounded-xl border shadow-sm"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Real-Time Price Chart
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Timeframe:</span>
              <select className="bg-transparent">
                {['1H', '4H', '1D', '1W', '1M'].map((tf) => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="h-[600px] p-4">
          <TradingViewWidget />
        </div>
      </motion.div>
</div>
  );
}