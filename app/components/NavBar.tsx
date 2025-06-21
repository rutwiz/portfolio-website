import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-heading text-2xl">
          The Rutwij
        </Link>
        <div className="space-x-4">
          <Link href="/about">About</Link>
          <Link href="/career">Career</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/hobbies">Hobbies</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 