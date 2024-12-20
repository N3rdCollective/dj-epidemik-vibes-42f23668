import { useEffect } from "react";

export const SocialFeeds = () => {
  useEffect(() => {
    // Load TikTok embed script
    const tiktokScript = document.createElement("script");
    tiktokScript.src = "https://www.tiktok.com/embed.js";
    tiktokScript.async = true;
    document.body.appendChild(tiktokScript);

    return () => {
      document.body.removeChild(tiktokScript);
    };
  }, []);

  return (
    <section className="py-16 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Follow My Social Media</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TikTok Feed */}
          <div className="w-full">
            <h3 className="text-2xl font-semibold text-white mb-6">Latest TikToks</h3>
            <blockquote 
              className="tiktok-embed" 
              cite="https://www.tiktok.com/@djepidemik" 
              data-unique-id="djepidemik"
              data-embed-type="creator" 
              style={{ maxWidth: "780px", minWidth: "288px" }}
            >
              <section>
                <a target="_blank" href="https://www.tiktok.com/@djepidemik?refer=creator_embed" rel="noopener noreferrer">@djepidemik</a>
              </section>
            </blockquote>
          </div>

          {/* Instagram Feed */}
          <div className="w-full">
            <h3 className="text-2xl font-semibold text-white mb-6">Instagram Feed</h3>
            <iframe
              src="https://www.instagram.com/djepidemik/embed"
              className="w-full min-h-[450px] border-none"
              loading="lazy"
              title="DJ Epidemik Instagram Feed"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};