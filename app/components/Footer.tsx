import SocialIcons from "./SocialIcons";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/60 bg-canvas/30 py-10 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <SocialIcons />
        <p className="mt-6 text-xs text-muted">
          &copy; {new Date().getFullYear()} The Rutwij. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
