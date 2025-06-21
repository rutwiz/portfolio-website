import SocialIcons from './SocialIcons';

const Footer = () => {
  return (
    <footer className="p-4 mt-8">
      <div className="container mx-auto text-center">
        <SocialIcons />
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Lord Rutwij. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 