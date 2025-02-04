"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section
      className="min-h-screen relative overflow-hidden flex items-center"
      id="about"
    >
      {/* Background with larger grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_64px]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-400">
              What is ForexCrypto Vision?
            </h2>
            <p className="text-lg text-muted-foreground">
              We are ForexPro, the leading global forex trading platform
              specializing in digital assets. We pioneer innovative financial
              products and services that provide traders with trust and
              transparency. Together, we're building the future of forex
              trading.
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold">
              Investor Relations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl" />
              <div className="relative w-full h-full">
                <img
                  src="/assets/bull.png"
                  alt="Trading Visualization"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
