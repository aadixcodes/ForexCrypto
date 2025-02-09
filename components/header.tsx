// Header.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setShowWelcome(window.innerWidth >= 1024);
    };

    // Check initial size
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update showWelcome based on menu button visibility
  useEffect(() => {
    const handleMenuVisibility = () => {
      if (window.innerWidth < 1024) {
        const menuButton = document.querySelector('[data-menu-button]');
        setShowWelcome(menuButton ? window.getComputedStyle(menuButton).opacity === '0' : false);
      }
    };

    // Create a MutationObserver to watch for changes in the menu button's style
    const observer = new MutationObserver(handleMenuVisibility);
    const menuButton = document.querySelector('[data-menu-button]');
    
    if (menuButton) {
      observer.observe(menuButton, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    // Check initial state
    handleMenuVisibility();

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="sticky top-0 border-b bg-background/80 backdrop-blur-lg z-30 h-16"
    >
      <div className="h-full flex items-center justify-between px-6 border-x">
        <div className="flex items-center">
          <h1 className={`text-xl font-semibold transition-opacity duration-300 ${
            showWelcome ? 'opacity-100' : 'opacity-0'
          }`}>
            Welcome Aditya !
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}