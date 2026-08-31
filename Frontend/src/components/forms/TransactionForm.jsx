import { useState } from "react";

function TransactionForm({ addTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("Salary");
  const [loading, setLoading] = useState(false);

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Other Income",
  ];

  const expenseCategories = [
    "Food",
    "Rent",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Travel",
    "Others",
  ];

  function handleTypeChange(e) {
  const newType = e.target.value;

  setType(newType);

  if (newType === "Income") {
    setCategory("Salary");
  } else {
    setCategory("Food");
  }
}
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !amount) {
      alert("Please enter both title and amount");
      return;
    }

    try {
      setLoading(true);
      //  Retrieve JWT Token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first!");
        return;
      }

      //  Make HTTP POST request to Express backend
      const response = await fetch("http://localhost:3000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass Auth token
        },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          type,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save transaction");
        return;
      }

      // Pass the real MongoDB object returned from server to state
      if (addTransaction) {
        addTransaction(data.data);
      }

      // Reset form
      setTitle("");
      setAmount("");
      setType("Income");
      setCategory("Salary");
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Network error: Could not connect to backend server");
    } finally {
      setLoading(false);
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-6">
        Add Transaction
      </h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Title
        </label>

        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Amount
        </label>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Type
        </label>

        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {(type === "Income"
            ? incomeCategories
            : expenseCategories
          ).map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Transaction"}
      </button>

    </form>
  );
}

export default TransactionForm;