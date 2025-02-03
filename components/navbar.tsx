// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { LineChart, Wallet, BookOpen, BarChart3, Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
// import { motion, AnimatePresence } from "framer-motion";

// export function Navbar() {
//   const [isScrolled, setIsScrolled] = React.useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

//   React.useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const menuItems = [
//     { href: "/about", label: "About Us" },
//     { href: "/pricing", label: "Pricing" },
//     { href: "/contact", label: "Contact" },
//   ];

//   const dropdownItems = {
//     "Forex Trading": [
//       { href: "/market-rates", label: "Market Rates", icon: <LineChart className="h-4 w-4" /> },
//       { href: "/tools", label: "Trading Tools", icon: <Wallet className="h-4 w-4" /> },
//     ],
//     "Trading Academy": [
//       { href: "/education", label: "Education", icon: <BookOpen className="h-4 w-4" /> },
//     ],
//   };

//   return (
//     <header
//       className={cn(
//         "fixed top-0 z-50 w-full transition-all duration-200",
//         isScrolled
//           ? "bg-background/80 backdrop-blur-lg border-b"
//           : "bg-transparent"
//       )}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <Link href="/" className="flex items-center space-x-2">
//             <BarChart3 className="h-8 w-8 text-primary" />
//             <span className="text-2xl font-bold">ForexCrypto</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center justify-center flex-1 space-x-6">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="text-xl hover:text-primary transition-colors"
//               >
//                 {item.label}
//               </Link>
//             ))}
            
//             {Object.entries(dropdownItems).map(([title, items]) => (
//               <DropdownMenu key={title}>
//                 <DropdownMenuTrigger className="text-xl hover:text-primary transition-colors">
//                   {title}
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   {items.map((item) => (
//                     <DropdownMenuItem key={item.href}>
//                       <Link href={item.href} className="flex items-center">
//                         {item.icon}
//                         <span className="ml-2">{item.label}</span>
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ))}
//           </nav>

//           <div className="flex items-center space-x-4">
//             <Button variant="ghost" className="hidden text-xl md:inline-flex">
//               Log In
//             </Button>
//             <Button className="hidden md:inline-flex text-xl bg-green-500 hover:bg-green-600">
//               Sign Up
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setIsMobileMenuOpen(true)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, x: "100%" }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: "100%" }}
//             transition={{ type: "tween", duration: 0.3 }}
//             className="fixed inset-0 bg-background z-50 md:hidden"
//           >
//             <div className="flex flex-col h-full">
//               <div className="flex items-center justify-between p-4 border-b">
//                 <Link href="/" className="flex items-center space-x-2">
//                   <BarChart3 className="h-6 w-6 text-primary" />
//                   <span className="text-xl font-bold">ForexCrypto</span>
//                 </Link>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               <div className="flex-1 overflow-y-auto py-4">
//                 <nav className="flex flex-col items-center space-y-4">
//                   {menuItems.map((item) => (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className="text-xl hover:text-primary transition-colors"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                     >
//                       {item.label}
//                     </Link>
//                   ))}
                  
//                   {Object.entries(dropdownItems).map(([title, items]) => (
//                     <div key={title} className="flex flex-col items-center space-y-2">
//                       <span className="text-lg font-medium">{title}</span>
//                       {items.map((item) => (
//                         <Link
//                           key={item.href}
//                           href={item.href}
//                           className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center"
//                           onClick={() => setIsMobileMenuOpen(false)}
//                         >
//                           {item.icon}
//                           <span className="ml-2">{item.label}</span>
//                         </Link>
//                       ))}
//                     </div>
//                   ))}
//                 </nav>
//               </div>

//               <div className="p-4 border-t">
//                 <div className="flex flex-col space-y-2">
//                   <Button variant="outline" className="w-full">
//                     Log In
//                   </Button>
//                   <Button className="w-full bg-green-500 hover:bg-green-600">
//                     Sign Up
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }



"use client";

import * as React from "react";
import Link from "next/link";
import { LineChart, Wallet, BookOpen, BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { href: "/about", label: "About Us" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const dropdownItems = {
    "Forex Trading": [
      { href: "/market-rates", label: "Market Rates", icon: <LineChart className="h-4 w-4" /> },
      { href: "/tools", label: "Trading Tools", icon: <Wallet className="h-4 w-4" /> },
    ],
    "Trading Academy": [
      { href: "/education", label: "Education", icon: <BookOpen className="h-4 w-4" /> },
    ],
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-2xl font-bold">ForexCrypto</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-4 xl:space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base xl:text-xl hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {Object.entries(dropdownItems).map(([title, items]) => (
              <DropdownMenu key={title}>
                <DropdownMenuTrigger className="text-base xl:text-xl hover:text-primary transition-colors">
                  {title}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {items.map((item) => (
                    <DropdownMenuItem key={item.href}>
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
            <Button variant="ghost" className="hidden lg:inline-flex text-base xl:text-xl">
              Log In
            </Button>
            <Button className="hidden lg:inline-flex text-base xl:text-xl bg-green-500 hover:bg-green-600">
              Sign Up
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-background z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">ForexCrypto</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col items-center space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-xl hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {Object.entries(dropdownItems).map(([title, items]) => (
                    <div key={title} className="flex flex-col items-center space-y-2">
                      <span className="text-lg font-medium">{title}</span>
                      {items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="p-4 border-t">
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full text-base">
                    Log In
                  </Button>
                  <Button className="w-full text-base bg-green-500 hover:bg-green-600">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}