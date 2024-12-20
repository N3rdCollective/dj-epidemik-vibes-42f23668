import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface MixcloudTrack {
  key: string;
  name: string;
  url: string;
  pictures: {
    large: string;
  };
  created_time: string;
}

export const Music = () => {
  const [isLoading, setIsLoading] = useState(true);
  const username = 'djepidemikmixes';

  const fetchMixes = async () => {
    console.log('Fetching mixes for:', username);
    try {
      const response = await axios.get(`https://api.mixcloud.com/${username}/cloudcasts/`);
      console.log('Mixcloud API response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching mixes:', error);
      throw error;
    }
  };

  const { data: mixes, error } = useQuery({
    queryKey: ['mixes', username],
    queryFn: fetchMixes,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  useEffect(() => {
    console.log('Music component mounted');
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

  if (error) {
    console.error('Error loading mixes:', error);
    return (
      <section className="py-20 bg-[#0A0A0A]" id="music">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Latest Mixes
          </h2>
          <div className="text-white text-center">Error loading mixes. Please try again later.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#0A0A0A]" id="music">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Latest Mixes
        </h2>
        
        {isLoading || !mixes ? (
          <div className="text-white text-center">Loading mixes...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mixes.map((mix: MixcloudTrack) => (
              <div key={mix.key} className="w-full aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(mix.key)}`}
                  frameBorder="0"
                  title={mix.name}
                ></iframe>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};