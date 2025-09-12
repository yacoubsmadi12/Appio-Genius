import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-xl font-bold">Appio Genius</span>
            </div>
            <p className="text-background/80 mb-4">
              AI-powered Android app generation for everyone. Turn your ideas into reality in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-background/60 hover:text-background transition-colors" data-testid="link-twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors" data-testid="link-linkedin">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors" data-testid="link-github">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-background/80">
              <li><Link href="/pricing" className="hover:text-background transition-colors" data-testid="footer-pricing">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              <li><Link href="/about" className="hover:text-background transition-colors" data-testid="footer-about">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-background transition-colors" data-testid="footer-contact">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-background/80">
              <li><Link href="/terms" className="hover:text-background transition-colors" data-testid="footer-terms">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-background transition-colors" data-testid="footer-privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/60 mb-4 md:mb-0">
            © 2024 Appio Genius. All rights reserved.
          </p>
          
          {/* Google Ads Placeholder in Footer */}
          <div className="p-3 border border-dashed border-background/20 rounded text-center" data-testid="footer-ad-space">
            <p className="text-background/40 text-xs">Advertisement</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
