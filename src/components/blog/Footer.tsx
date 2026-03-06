const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">H</span>
            </div>
            <span className="text-sm font-bold text-foreground">THE LOGIC</span>
            <span className="text-xs text-muted-foreground">by Hyperwise</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">RSS</a>
          </div>

          <p className="text-xs text-text-caption">
            © 2026 Hyperwise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
