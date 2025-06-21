import Layout from '../components/Layout';
import projectsData from '../content/projects.json';
import Link from 'next/link';
import Image from 'next/image';

const ProjectsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-heading mb-8">{projectsData.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsData.projects.map((project, index) => (
            <div key={index} className="border border-gray-700 p-4 rounded">
              <div className="relative w-full h-48 mb-4">
                <Image src={project.image} alt={project.name} layout="fill" objectFit="cover" className="rounded" />
              </div>
              <h2 className="text-2xl font-heading">{project.name}</h2>
              <p className="mt-2 mb-4 font-body">{project.description}</p>
              <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-sunset-orange hover:underline">
                View on GitHub
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage; 