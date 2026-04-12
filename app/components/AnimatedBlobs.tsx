type Props = { intensity?: "normal" | "quiet" };

const AnimatedBlobs = ({ intensity = "normal" }: Props) => {
  const opacity = intensity === "quiet" ? "opacity-[0.22]" : "opacity-[0.38]";
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className={`absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-sage blur-3xl animate-blob ${opacity}`}
      />
      <div
        className={`absolute -right-32 -top-16 h-96 w-96 rounded-full bg-accent-mist blur-3xl animate-blob animation-delay-2000 ${opacity}`}
      />
      <div
        className={`absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-nocturne blur-3xl animate-blob animation-delay-4000 ${opacity}`}
      />
    </div>
  );
};

export default AnimatedBlobs;
