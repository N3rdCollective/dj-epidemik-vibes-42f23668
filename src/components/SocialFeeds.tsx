import { Instagram, Tiktok } from "lucide-react";

export const SocialFeeds = () => {
  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Follow My Social Media</h2>
        
        <div className="flex justify-center items-center gap-8">
          {/* TikTok Link */}
          <a 
            href="https://www.tiktok.com/@djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center transition-transform hover:scale-110"
          >
            <Tiktok className="w-16 h-16 text-white mb-2" />
            <span className="text-white text-lg">TikTok</span>
          </a>

          {/* Instagram Link */}
          <a 
            href="https://www.instagram.com/djepidemik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center transition-transform hover:scale-110"
          >
            <Instagram className="w-16 h-16 text-white mb-2" />
            <span className="text-white text-lg">Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};