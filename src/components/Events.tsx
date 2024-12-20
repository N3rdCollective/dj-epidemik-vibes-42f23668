export const Events = () => {
  const events = [
    {
      date: "MAR 15",
      venue: "Club Nova",
      location: "Los Angeles, CA",
      time: "10 PM - 2 AM",
    },
    {
      date: "MAR 22",
      venue: "Electric Festival",
      location: "Miami, FL",
      time: "9 PM - 1 AM",
    },
    {
      date: "APR 05",
      venue: "The Underground",
      location: "New York, NY",
      time: "11 PM - 4 AM",
    },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A]" id="events">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Upcoming Events
        </h2>
        <div className="max-w-4xl mx-auto">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-6 mb-4 hover:bg-gray-800 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-2xl font-bold text-primary mb-4 md:mb-0">
                  {event.date}
                </div>
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-white">{event.venue}</h3>
                  <p className="text-gray-400">{event.location}</p>
                </div>
                <div className="text-gray-300">{event.time}</div>
                <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-full transition-colors">
                  Get Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};