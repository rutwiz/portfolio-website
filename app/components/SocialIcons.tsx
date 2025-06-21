import Link from 'next/link';

// In a real app, you'd use icons from a library like react-icons
const SocialIcons = () => {
  return (
    <div className="flex justify-center space-x-4">
      <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        Instagram
      </Link>
      <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
        GitHub
      </Link>
      <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
        YouTube
      </Link>
    </div>
  );
};

export default SocialIcons; 