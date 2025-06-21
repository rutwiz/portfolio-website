import Layout from '../components/Layout';
import aboutData from '../content/about.json';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 text-center">
        <Image 
          src={aboutData.avatar}
          alt="Rutwij"
          width={150}
          height={150}
          className="rounded-full mx-auto mb-8"
        />
        <h1 className="text-4xl font-heading mb-4">{aboutData.title}</h1>
        <p className="font-body max-w-2xl mx-auto">{aboutData.biography}</p>
      </div>
    </Layout>
  );
};

export default AboutPage; 