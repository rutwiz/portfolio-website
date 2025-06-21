import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const HeroSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={targetRef} className="h-screen relative overflow-hidden">
      <motion.div
        className="absolute inset-x-0 -top-[10vh] bottom-[-10vh] z-0"
        style={{ y }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero.jpg)' }}
        />
      </motion.div>
      
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center"
      >
        <h1 className="text-6xl font-heading mb-4">
          Welcome to My World
        </h1>
        <p className="text-xl font-body">
          A digital reflection of my brand, values, and journey.
        </p>
      </motion.div>
    </div>
  );
};

export default HeroSection; 