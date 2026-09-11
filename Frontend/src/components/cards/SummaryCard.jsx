function SummaryCard({ title, amount, icon, color }) {
  const colors = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
  };

  return (
    <div
      className={`w-full bg-white rounded-xl shadow-md p-6 border-l-4 ${colors[color]} hover:shadow-xl transition duration-300`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>

        <h3 className="text-gray-500 text-base lg:text-lg">
          {title}
        </h3>
      </div>

      <h2 className="text-2xl lg:text-3xl font-bold mt-4">
        ${amount}
      </h2>
    </div>
  );
}

export default SummaryCard;

