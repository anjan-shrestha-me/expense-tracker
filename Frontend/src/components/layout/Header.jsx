function Header() {

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            💰 Expense Tracker
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome ! Manage your finances efficiently.
          </p>

        </div>

        <div className="text-right">

          <p className="text-gray-500 text-sm">
            Today
          </p>

          <p className="font-semibold text-gray-700">
            {today}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Header;