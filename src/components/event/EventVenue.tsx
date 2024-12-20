interface EventVenueProps {
  venue: string;
  location: string;
}

export const EventVenue = ({ venue, location }: EventVenueProps) => {
  return (
    <div className="text-center md:text-left flex-1">
      <h3 className="text-2xl font-semibold text-white mb-1">{venue}</h3>
      <p className="text-gray-400">{location}</p>
    </div>
  );
};