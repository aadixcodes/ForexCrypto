"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '../auth-context';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // ... other form fields
  });

  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/sign-up/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        setAuth(data.user.id, data.user.email);
        // Redirect to the dashboard or desired page
      } else {
        const errorData = await response.json();
        console.error('Signup error:', errorData);
        // Handle error state
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error state
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden pt-24">
      {/* Trading Graph Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
        <Image
          src="/assets/bull.png"
          alt="Trading background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center mb-6"
            >
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-400">
                Get Started Now
              </h1>
            </motion.div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join our platform to access advanced trading tools, real-time market data, 
              and professional trading resources.
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-card/70 backdrop-blur-lg rounded-xl p-8 border border-green-500/20 shadow-2xl shadow-green-500/10 mb-12">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-primary mb-5">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                  <Input placeholder="Last Name" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                </div>
                <Input placeholder="Email Address" type="email" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Username" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="bg-background/80 border-green-500/30 focus:border-green-500/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Input placeholder="Gender" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Mobile Number" type="tel" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Aadhar Number" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Date of Birth" type="date" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Address" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
              </div>

              {/* Bank & Nominee Details */}
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-primary mb-5">Bank Details</h3>
                <Input placeholder="Bank Name" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Account Holder Name" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Account Number" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="IFSC Code" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="PAN Number" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />

                <h3 className="text-xl font-semibold text-primary mt-8 mb-5">Nominee Details</h3>
                <Input placeholder="Nominee Name" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Nominee Relation" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
                <Input placeholder="Nominee Date of Birth" type="date" className="bg-background/80 border-green-500/30 focus:border-green-500/50" />
              </div>

              {/* Terms & Submit Section */}
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-green-500/20">
                <label className="flex items-center space-x-2 order-2 sm:order-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-green-500/30 focus:ring-green-500/50"
                  />
                  <span className="text-sm text-muted-foreground">
                    I agree to the <Link href="#" className="text-primary hover:underline">Terms & Conditions</Link>
                  </span>
                </label>
                
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 font-semibold px-8 py-6 order-1 sm:order-2"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-green-600 font-medium">
                Sign in here
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default SignupForm;