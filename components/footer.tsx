import Link from "next/link";
import { Twitter, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="container px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/risk" className="text-muted-foreground hover:text-primary transition-colors">Risk Disclaimer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-card/50 backdrop-blur-sm p-2 rounded">
                  <img 
                    src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg" 
                    alt="Visa" 
                    className="h-6 w-6 invert" 
                  />
                </div>
                <div className="bg-card/50 backdrop-blur-sm p-2 rounded">
                  <img 
                    src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg" 
                    alt="Mastercard" 
                    className="h-6 w-6 invert" 
                  />
                </div>
                <div className="bg-card/50 backdrop-blur-sm p-2 rounded">
                  <img 
                    src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paypal.svg" 
                    alt="PayPal" 
                    className="h-6 w-6 invert" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border/40">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} ForexPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}