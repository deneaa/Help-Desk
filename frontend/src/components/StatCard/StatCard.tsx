const StatCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-gray-900 text-3xl">{value}</p>
    </div>
  );
};

export default StatCard;
