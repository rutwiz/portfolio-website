import Layout from '../components/Layout';
import hobbiesData from '../content/hobbies.json';

const HobbiesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-heading mb-8">{hobbiesData.title}</h1>
        <div className="space-y-8">
          {hobbiesData.hobbies.map((hobby, index) => (
            <div key={index}>
              <h2 className="text-2xl font-heading">{hobby.name}</h2>
              <p className="mt-2 font-body">{hobby.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HobbiesPage; 