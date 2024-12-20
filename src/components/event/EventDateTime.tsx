interface EventDateTimeProps {
  time: string;
}

export const EventDateTime = ({ time }: EventDateTimeProps) => {
  return (
    <div className="text-gray-300 font-medium whitespace-nowrap">
      {time}
    </div>
  );
};