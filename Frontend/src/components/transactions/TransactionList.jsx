import {
  FaTrash,
  FaEdit,
  FaMoneyBillWave,
  FaLaptopCode,
  FaChartLine,
  FaGift,
  FaUtensils,
  FaHome,
  FaCar,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaFilm,
  FaHeartbeat,
  FaBook,
  FaPlane,
  FaBox,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const categoryIcons = {
  Salary: <FaMoneyBillWave className="text-green-600 text-lg" />,
  Freelance: <FaLaptopCode className="text-blue-600 text-lg" />,
  Investment: <FaChartLine className="text-purple-600 text-lg" />,
  Gift: <FaGift className="text-pink-500 text-lg" />,

  Food: <FaUtensils className="text-orange-500 text-lg" />,
  Rent: <FaHome className="text-indigo-500 text-lg" />,
  Transport: <FaCar className="text-sky-500 text-lg" />,
  Shopping: <FaShoppingCart className="text-yellow-500 text-lg" />,
  Bills: <FaFileInvoiceDollar className="text-red-500 text-lg" />,
  Entertainment: <FaFilm className="text-violet-500 text-lg" />,
  Health: <FaHeartbeat className="text-rose-500 text-lg" />,
  Education: <FaBook className="text-cyan-600 text-lg" />,
  Travel: <FaPlane className="text-teal-500 text-lg" />,
  Others: <FaBox className="text-gray-500 text-lg" />,
};

function TransactionList({
  transactions,
  deleteTransaction,
  editTransaction,
  title,
}) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center mt-8">
        <h2 className="text-2xl font-bold mb-3">
          No Transactions
        </h2>

        <p className="text-gray-500">
          Add your first transaction to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {title}
      </h2>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-none"
          >
            {/* Left Side */}
            <div>
              <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                {categoryIcons[transaction.category] || (
                  <FaBox className="text-gray-500 text-lg" />
                )}

                {transaction.title}
              </h3>

              <p
                className={`text-sm mt-1 ${transaction.type?.toLowerCase() === "income"
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {transaction.type} • {transaction.category} •{" "}
                {transaction.date && !isNaN(new Date(transaction.date).getTime())
                  ? new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  : "N/A"}

              </p>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-5">
              <p
                className={`text-xl font-bold ${transaction.type?.toLowerCase() === "income"
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {transaction.type?.toLowerCase() === "income"
                  ? "+"
                  : "-"}
                ${transaction.amount}
              </p>

              {/* Edit */}
              <button
                type="button"
                onClick={() => editTransaction(transaction)}
                className="text-blue-500 hover:text-blue-700 transition"
              >
                <FaEdit size={18} />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => deleteTransaction(transaction._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {title === "Recent Transactions" && (
        <div className="mt-6 text-center">
          <Link
            to="/transaction"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All Transactions →
          </Link>
        </div>
      )}
    </div>
  );
}

export default TransactionList;