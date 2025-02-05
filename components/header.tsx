"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="sticky top-0 border-b bg-background/80 backdrop-blur-lg z-40"
    >
      <div className="flex items-center justify-between p-4 lg:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>
    </motion.header>
  );
}