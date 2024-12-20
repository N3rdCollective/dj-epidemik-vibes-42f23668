export const SocialFeeds = () => {
  return (
    <section className="py-24 bg-[#1A1F2C]">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-bold text-white mb-16 text-center">Follow My Social Media</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 justify-items-center max-w-6xl mx-auto px-4">
          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img 
              src="/lovable-uploads/5b22d913-f29a-44be-ade7-9cb9998bdfa2.png" 
              alt="TikTok"
              className="w-20 h-20 object-contain"
            />
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img 
              src="/lovable-uploads/21ed7291-01cd-4dfc-8175-21508d29c5e5.png" 
              alt="Instagram"
              className="w-20 h-20 object-contain"
            />
          </a>

          {/* Twitch */}
          <a 
            href="https://www.twitch.tv/djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img 
              src="/lovable-uploads/5a5e7011-8973-4aeb-aad0-1bf54d71db10.png" 
              alt="Twitch"
              className="w-20 h-20 object-contain"
            />
          </a>

          {/* Audius */}
          <a 
            href="https://audius.co/djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img 
              src="/lovable-uploads/6fba7428-150d-4816-8bb9-871c72802442.png" 
              alt="Audius"
              className="w-20 h-20 object-contain"
            />
          </a>

          {/* Spotify */}
          <a 
            href="https://open.spotify.com/artist/djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img 
              src="/lovable-uploads/c14c4f13-480e-4d4e-8c2b-fda509f7aaa5.png" 
              alt="Spotify"
              className="w-20 h-20 object-contain"
            />
          </a>

          {/* Apple Music */}
          <a 
            href="https://music.apple.com/artist/djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img 
              src="/lovable-uploads/cf580d75-ac52-431b-a484-0072baf7538c.png" 
              alt="Apple Music"
              className="w-20 h-20 object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
};