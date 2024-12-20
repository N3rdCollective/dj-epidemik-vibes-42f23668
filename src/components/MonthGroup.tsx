interface MonthGroupProps {
  month: string;
  children: React.ReactNode;
}

export const MonthGroup = ({ month, children }: MonthGroupProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-primary mb-4 border-b border-gray-700 pb-2">
        {month}
      </h3>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};