"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart,
  Wallet,
  History,
  CircleDollarSign,
  ArrowDownUp,
  HandCoins,
  Settings,
  Lock
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Charts", href: "/dashboard/charts", icon: <BarChart className="h-5 w-5" /> },
    { name: "Transactions", href: "/dashboard/transactions", icon: <ArrowDownUp className="h-5 w-5" /> },
    { name: "Order History", href: "/dashboard/orders", icon: <History className="h-5 w-5" /> },
    { name: "Deposit", href: "/dashboard/deposit", icon: <CircleDollarSign className="h-5 w-5" /> },
    { name: "Withdraw", href: "/dashboard/withdraw", icon: <Wallet className="h-5 w-5" /> },
    { name: "Loan Request", href: "/dashboard/loan-request", icon: <HandCoins className="h-5 w-5" /> },
    { name: "Account Settings", href: "/dashboard/account-settings", icon: <Settings className="h-5 w-5" /> },
    { name: "Change Password", href: "/dashboard/change-password", icon: <Lock className="h-5 w-5" /> },
  ];

  return (
    <motion.nav
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 border-r bg-background/80 backdrop-blur-lg z-50 shadow-xl"
    >
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">ForexCrypto</h1>
      </div>
      
      <div className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-accent/50"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}