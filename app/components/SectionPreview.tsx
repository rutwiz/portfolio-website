import Link from 'next/link';
import { motion } from 'framer-motion';

type SectionPreviewProps = {
  title: string;
  description: string;
  link: string;
  accentColor: string;
};

const SectionPreview: React.FC<SectionPreviewProps> = ({ title, description, link, accentColor }) => {
  return (
    <motion.div 
      className="p-8 my-16 mx-auto max-w-4xl border rounded-lg"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-heading mb-4" style={{ color: accentColor }}>{title}</h2>
      <p className="font-body mb-6">{description}</p>
      <Link href={link} className="font-bold hover:underline" style={{ color: accentColor }}>
        Explore More &rarr;
      </Link>
    </motion.div>
  );
};

export default SectionPreview; 