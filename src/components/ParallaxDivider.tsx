import { Parallax } from 'react-parallax';

export const ParallaxDivider = () => {
  console.log('Rendering ParallaxDivider component');
  
  return (
    <Parallax
      blur={0}
      bgImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
      bgImageAlt="Parallax Background"
      strength={200}
      className="h-[40vh]"
    >
      <div className="h-full w-full bg-black/30" />
    </Parallax>
  );
};