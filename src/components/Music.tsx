import { useEffect, useState } from 'react';

export const Music = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log when the component mounts
    console.log('Music component mounted');
    
    // Add Mixcloud widget script
    const script = document.createElement('script');
    script.src = 'https://widget.mixcloud.com/media/js/widgetApi.js';
    script.async = true;
    script.onload = () => {
      console.log('Mixcloud widget script loaded');
      setIsLoading(false);
    };
    script.onerror = (error) => console.error('Error loading Mixcloud script:', error);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="py-20 bg-[#0A0A0A]" id="music">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Latest Mixes
        </h2>
        
        {isLoading ? (
          <div className="text-white text-center">Loading mixes...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fdjepidemikmixes%2Fepidemic-of-sound-vol-1%2F" 
                frameBorder="0"
                title="DJ Epidemik - Epidemic of Sound Vol. 1"
              ></iframe>
            </div>
            <div className="w-full aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fdjepidemikmixes%2Fepidemic-of-sound-vol-2%2F" 
                frameBorder="0"
                title="DJ Epidemik - Epidemic of Sound Vol. 2"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};