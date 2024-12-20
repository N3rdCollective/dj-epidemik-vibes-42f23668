export const Music = () => {
  return (
    <section className="py-20 bg-[#0A0A0A]" id="music">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Latest Tracks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((track) => (
            <div
              key={track}
              className="bg-gray-900 rounded-lg p-6 hover:transform hover:scale-105 transition-transform"
            >
              <div className="aspect-square bg-gray-800 rounded-lg mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Track Title {track}
              </h3>
              <p className="text-gray-400">Latest Release</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};