import { Parallax } from 'react-parallax';

export const ParallaxDivider = () => {
  console.log('Rendering ParallaxDivider component');
  
  return (
    <Parallax
      blur={0}
      bgImage="lovable-uploads/3c4e9ce6-c793-4f96-b6fa-a9bde6ea6c8c.png"
      bgImageAlt="DJ EPIDEMIK portrait"
      strength={200}
      className="h-screen relative" // Changed from h-[60vh] to h-screen for full height
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Experience the Vibe</h2>
        <p className="text-xl text-gray-200 max-w-2xl">
          Bringing energy and excitement to every event with a unique blend of music and performance
        </p>
      </div>
    </Parallax>
  );
};