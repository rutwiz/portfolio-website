const AnimatedBlobs = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute w-96 h-96 bg-sunset-orange rounded-full -left-32 -top-32 opacity-50 filter blur-3xl animate-blob" />
      <div className="absolute w-96 h-96 bg-electric-blue rounded-full -right-32 -top-16 opacity-50 filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute w-96 h-96 bg-lush-green rounded-full -bottom-32 left-1/3 opacity-50 filter blur-3xl animate-blob animation-delay-4000" />
    </div>
  );
};

export default AnimatedBlobs; 