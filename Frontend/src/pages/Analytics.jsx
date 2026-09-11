import { useState, useEffect } from "react";
import SummaryCard from "../components/cards/SummaryCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dedicated category color mappings for Pie Chart (strictly non-overlapping with Bar Chart Income #10b981 & Expense #ef4444)
const CATEGORY_COLORS = {
  Food: "#f97316",          // Orange
  Rent: "#6366f1",          // Indigo
  Transport: "#0ea5e9",     // Sky Blue
  Shopping: "#eab308",      // Amber Yellow
  Bills: "#a855f7",         // Purple (Distinct from Expense Red)
  Entertainment: "#ec4899", // Hot Pink
  Health: "#06b6d4",        // Cyan
  Education: "#14b8a6",     // Teal
  Travel: "#84cc16",        // Lime Green
  Others: "#64748b",        // Slate Gray
  Salary: "#3b82f6",        // Royal Blue (Distinct from Income Green)
  Freelance: "#d946ef",     // Fuchsia
  Investment: "#8b5cf6",    // Deep Violet
  Gift: "#f472b6",          // Light Rose
  "Other Income": "#94a3b8" // Cool Gray
};

// Fallback palette for any dynamic categories not listed above (zero overlap with Bar Chart colors)
const FALLBACK_PALETTE = [
  "#f97316", "#6366f1", "#0ea5e9", "#eab308", "#a855f7",
  "#ec4899", "#06b6d4", "#14b8a6", "#84cc16", "#64748b"
];

// Bar Chart Colors
const BAR_INCOME_COLOR = "#10b981"; // Emerald Green
const BAR_EXPENSE_COLOR = "#ef4444"; // Crimson Red

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:3000/api/transactions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch transactions.");
          setLoading(false);
          return;
        }

        setTransactions(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Something went wrong while loading analytics.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const income = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expense = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const balance = income - expense;

  const totalTransactions = transactions.length;

  const chartData = [
    {
      name: "Income",
      amount: income,
    },
    {
      name: "Expense",
      amount: expense,
    },
  ];

  const categoryChartData = Object.entries(
    transactions
      .filter((transaction) => transaction.type?.toLowerCase() === "expense")
      .reduce((categories, transaction) => {
        if (!categories[transaction.category]) {
          categories[transaction.category] = 0;
        }

        categories[transaction.category] += Number(transaction.amount);

        return categories;
      }, {})
  ).map(([name, amount]) => ({
    name,
    amount,
  }));

  // Ensures Pie Chart colors NEVER match Bar Chart Income or Expense colors
  const getPieCellColor = (entry, index) => {
    let color = CATEGORY_COLORS[entry.name] || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];

    if (color.toLowerCase() === BAR_INCOME_COLOR.toLowerCase() || color.toLowerCase() === BAR_EXPENSE_COLOR.toLowerCase()) {
      return "#8b5cf6"; // Fallback to purple if there's any collision
    }

    return color;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600 font-medium">
          {error}
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-10 text-center h-120 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          No transactions yet
        </h2>

        <p className="text-xl text-gray-500 mt-2">
          Add your first transaction to see your analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clean Header without Dropdown */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Analytics
        </h1>

        <p className="text-gray-500 mt-1">
          Get insights about your finances and spending habits.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Balance"
          amount={balance}
          icon="💳"
          color="blue"
        />

        <SummaryCard
          title="Income"
          amount={income}
          icon="🟢"
          color="green"
        />

        <SummaryCard
          title="Expense"
          amount={expense}
          icon="🔴"
          color="red"
        />

        <SummaryCard
          title="Transactions"
          amount={totalTransactions}
          icon="📄"
          color="purple"
        />
      </div>

      {/* Income vs Expense Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Income vs Expense
          </h2>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: BAR_INCOME_COLOR }}></span>
              Income
            </span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: BAR_EXPENSE_COLOR }}></span>
              Expense
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" barSize={80}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? BAR_INCOME_COLOR : BAR_EXPENSE_COLOR}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Where Your Expenses Go Pie Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Where Your Expenses Go
        </h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryChartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getPieCellColor(entry, index)}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
