"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { QrCode, CreditCard, Banknote, Wallet, CheckCircle } from "lucide-react";
import Razorpay from "razorpay";
import { useAuth } from "@/app/auth-context";

// Define types
type PaymentMethod = {
  id: string;
  name: string;
  icon: JSX.Element;
};

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const paymentMethods: PaymentMethod[] = [
    { id: "card", name: "Credit Card", icon: <CreditCard className="h-5 w-5" /> },
    { id: "bank", name: "Bank Transfer", icon: <Banknote className="h-5 w-5" /> },
    { id: "wallet", name: "E-Wallet", icon: <Wallet className="h-5 w-5" /> },
  ];

  const initializeRazorpay = async () => {
    return new Promise<void>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Initialize Razorpay
      await initializeRazorpay();

      // Create order
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: parseFloat(amount) * 100,
          userId
        }),
      });

      const data = await response.json();

      // Configure Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(amount) * 100,
        currency: "INR",
        name: "Your Company Name",
        description: "Deposit Transaction",
        order_id: data.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment
            const verificationResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: parseFloat(amount),
                userId
              }),
            });

            const verificationData = await verificationResponse.json();

            if (verificationData.success) {
              setIsSubmitted(true);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#0066FF",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Deposit Funds</h1>
      </motion.div>

      {!isSubmitted ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-background/80 backdrop-blur-lg rounded-xl border p-6 shadow-sm max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Deposit Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-background border rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter amount"
                  min="10"
                  required
                />
                <span className="absolute right-4 top-3.5 text-muted-foreground">USD</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div  className="hidden">
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/30"
                    }`}
                  >
                    {method.icon}
                    <span className="text-sm">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 hidden">
              {selectedMethod === "qr" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="bg-white p-4 rounded-lg">
                    {/* Replace with your actual QR code */}
                    <QrCode className="h-40 w-40 text-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scan this QR code using your mobile banking app to complete the payment
                  </p>
                </motion.div>
              )}

              {selectedMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full bg-background border rounded-lg py-2 px-4"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full bg-background border rounded-lg py-2 px-4"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        className="w-full bg-background border rounded-lg py-2 px-4"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Add similar sections for other payment methods */}

            </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Confirm Deposit"}
              </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background/80 backdrop-blur-lg rounded-xl border p-8 shadow-sm max-w-md mx-auto text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Deposit Successful!</h2>
          <p className="text-muted-foreground mb-4">
            ${amount} has been added to your account balance
          </p>
          <button
            onClick={() => {
              setAmount("");
              setIsSubmitted(false);
            }}
            className="text-primary hover:text-primary/80"
          >
            Make Another Deposit
          </button>
        </motion.div>
      )}
    </div>
  );
}