"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "aditya@patel" && password === "patel@123") {
      router.push("/dashboard");
    } else if (username === "admin@patel" && password === "admin@123") {
      router.push("/admin");
    } else {
      setError("Incorrect username or password. Please try again.");
    }
  };

  return (
    <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-14">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          {/* Logo and Heading */}
          <div className="flex flex-col items-center mb-8">
            <BarChart3 className="h-8 w-8 text-primary mb-4" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-400">
              Welcome Back !! 
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to continue</p>
          </div>

          {/* Login Form */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border shadow-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email or Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  className="bg-background/70 border-green-500/20 focus:border-green-500/50 focus:ring-green-500/30"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-background/70 border-green-500/20 focus:border-green-500/50 focus:ring-green-500/30 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 font-semibold"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-green-600 transition-colors font-medium"
              >
                Sign up here
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
}

export default LoginPage;