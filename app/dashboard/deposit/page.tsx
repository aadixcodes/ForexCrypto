"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, QrCode, Loader2, CreditCard } from "lucide-react";
import { useAuth } from "@/app/auth-context";
import Image from "next/image";
import LoadingOverlay from "@/components/ui/loading-overlay";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { userId } = useAuth();

  const generateQRCode = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    const upiID = "developer.aditya09@oksbi"; // Your UPI ID
    const businessName = "Astex"; // Your Business Name
    const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR`;
    
    const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
    setQrCodeUrl(qrAPI);
  };

  // Generate QR code when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      generateQRCode();
    }
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create deposit request
      const response = await fetch("/api/create-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: parseFloat(amount),
          userId,
          paymentMethod: "UPI"
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTransactionId(data.transactionId);
        setIsSubmitted(true);
      } else {
        throw new Error(data.message || "Failed to submit deposit request");
      }
    } catch (error) {
      console.error("Deposit request failed:", error);
      alert("Failed to submit deposit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const App = () => {
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [upiLink, setUpiLink] = useState<string>('');

    const generateQR = () => {
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      setIsLoading(true);
      setQrCodeUrl(''); // Clear previous QR code
      const upiId = "investingtradingg@ybl";
      const businessName = "Forex Crypto";
      const upiLinkData =
        `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&mc=0000&tn=Payment+for+order`;
      setUpiLink(upiLinkData);
      // Simulate API delay
      setTimeout(() => {
        const qrAPI = `https://api.qrserver.com/v1/create-qrcode/?size=200x200&data=${encodeURIComponent(upiLinkData)}`;
        setQrCodeUrl(qrAPI);
        setIsLoading(false);
      }, 1500);
    };

    const handlePayment = () => {
      if (upiLink) {
        window.location.href = upiLink;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
          <div className="text-center">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">QR Code Payment</h1>
            <p className="text-gray-500 mt-2">Enter amount to generate payment QR</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">INR</span>
            </div>
            <button
              onClick={generateQR}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating QR...
                </>
              ) : (
                'Generate QR Code'
              )}
            </button>
          </div>
          <div className="space-y-4">
            {isLoading && (
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-loading-bar"></div>
              </div>
            )}
            {qrCodeUrl && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Make Payment
                </button>
              </div>
            )}
          </div>
          <div className="text-center text-sm text-gray-500">
            Secure payments powered by UPI
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {isLoading && <LoadingOverlay message="Processing deposit request..." />}
      
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

            {/* UPI QR Code */}
            <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-center">Scan QR Code to Pay</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Use any UPI app to scan this code and make payment
              </p>
              {qrCodeUrl ? (
                <div className="bg-white p-4 rounded-lg mx-auto">
                  <Image 
                    src={qrCodeUrl} 
                    alt="UPI QR Code" 
                    width={200} 
                    height={200} 
                    className="mx-auto"
                  />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Enter a valid amount to generate QR code
                </div>
              )}
              <div className="text-sm space-y-1 w-full">
                <p><span className="font-medium">UPI ID:</span> developer.aditya09@oksbi</p>
                <p><span className="font-medium">Merchant:</span> Astex</p>
                <p><span className="font-medium">Amount:</span> ₹{amount || "0"}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                After payment, click &quot;Submit Deposit Request&quot; to record your transaction.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Submit Deposit Request"}
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
          <h2 className="text-2xl font-bold mb-2">Deposit Request Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your deposit request for ${amount} has been submitted successfully.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Transaction ID: {transactionId}<br />
            Your deposit will be processed after verification by admin, which usually takes 1-24 hours.
          </p>
          <button
            onClick={() => {
              setAmount("");
              setIsSubmitted(false);
              setQrCodeUrl("");
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