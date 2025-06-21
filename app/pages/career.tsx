import Layout from '../components/Layout';
import careerData from '../content/career.json';

const CareerPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-heading mb-8">{careerData.title}</h1>
        <div>
          {careerData.timeline.map((item, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-heading">{item.role}</h2>
              <h3 className="text-xl text-electric-blue">{item.company}</h3>
              <p className="text-sm text-gray-400">{item.period}</p>
              <p className="mt-2 font-body">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CareerPage; 