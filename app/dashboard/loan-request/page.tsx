"use client";

import { motion } from "framer-motion";
import { useState, FormEvent, useEffect } from "react";
import { Coins, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/auth-context";
import { useRouter } from "next/navigation";

type LoanRequest = {
  id: string;
  amount: number;
  duration: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export default function LoanRequestPage() {
  const { userId, isLoading } = useAuth();
  const router = useRouter();
  
  const [amount, setAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("3");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [existingLoan, setExistingLoan] = useState<LoanRequest | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !userId) {
      router.push('/login');
      return;
    }

    const checkExistingLoan = async () => {
      try {
        const response = await fetch('/api/loan-request');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setExistingLoan(data);
            setIsSubmitted(true);
          }
        }
      } catch (error) {
        console.error('Error checking loan status:', error);
      }
    };

    checkExistingLoan();
  }, [userId, isLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('/api/loan-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          duration: parseInt(duration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit loan request');
      }

      setExistingLoan(data);
      setIsSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit loan request');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Loan Request</h1>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!isSubmitted ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Loan Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Loan Amount (₹)
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
                    <span className="absolute right-4 top-2.5 text-muted-foreground">₹</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Loan Duration (Months)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-background border rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary"
                  >
                    {[3, 6, 9, 12].map((months) => (
                      <option key={months} value={months}>{months} Months</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-red-400/10 p-4 rounded-lg text-sm text-red-300">
              <p>⚠️ Please review the loan terms carefully before submitting.</p>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
              >
                Submit Loan Request
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
          <h2 className="text-2xl font-bold mb-2">Loan Request {existingLoan?.status.toLowerCase()}</h2>
          <p className="text-muted-foreground mb-4">
            Your loan request for ₹{existingLoan?.amount} is {existingLoan?.status.toLowerCase()}.
            {existingLoan?.status === 'PENDING' && " We will contact you within 24 hours."}
          </p>
          {existingLoan?.status === 'REJECTED' && ( 
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Create New Request
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}