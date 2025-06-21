import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import SectionPreview from '../components/SectionPreview';

const HomePage = () => {
  return (
    <Layout hideStaticBackground={true}>
      <HeroSection />
      <div className="relative z-20 bg-black">
        <div className="container mx-auto px-4">
          <SectionPreview 
            title="About Me"
            description="A glimpse into my personal philosophies, beliefs, and journey."
            link="/about"
            accentColor="#00BFFF" // electric-blue
          />
          <SectionPreview 
            title="My Career"
            description="A timeline of my professional roles and achievements."
            link="/career"
            accentColor="#FF6347" // sunset-orange
          />
          <SectionPreview 
            title="My Projects"
            description="A collection of projects I've built and contributed to."
            link="/projects"
            accentColor="#32CD32" // lush-green
          />
          {/* You can add a preview for Hobbies here as well if you like */}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
