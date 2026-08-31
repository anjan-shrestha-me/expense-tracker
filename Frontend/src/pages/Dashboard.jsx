import { useEffect, useState } from "react";
import SummaryCard from "../components/cards/SummaryCard";
import TransactionForm from "../components/forms/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transaction being edited
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState("income");
  const [editCategory, setEditCategory] = useState("");

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
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

        if (response.ok && data.data) {
          setTransactions(data.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch transactions:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Add transaction
  function addTransaction(newTransaction) {
    setTransactions((prev) => [
      newTransaction,
      ...prev,
    ]);
  }

  // Delete transaction
  async function deleteTransaction(id) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete transaction"
        );
        return;
      }

      setTransactions((prev) =>
        prev.filter(
          (transaction) => transaction._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete transaction:",
        error
      );
    }
  }

  // Start editing
  function editTransaction(transaction) {
    setEditingTransaction(transaction);

    setEditTitle(transaction.title);
    setEditAmount(transaction.amount);
    setEditType(
      transaction.type?.toLowerCase() === "income"
        ? "income"
        : "expense"
    );
    setEditCategory(transaction.category);
  }

  // Update transaction
  async function updateTransaction(e) {
    e.preventDefault();

    if (!editingTransaction) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/transactions/${editingTransaction._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            amount: Number(editAmount),
            type: editType,
            category: editCategory,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update transaction"
        );
        return;
      }

      // Replace old transaction with updated transaction
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === editingTransaction._id
            ? data.data
            : transaction
        )
      );

      // Close edit form
      setEditingTransaction(null);

      setEditTitle("");
      setEditAmount("");
      setEditType("income");
      setEditCategory("");
    } catch (error) {
      console.error(
        "Failed to update transaction:",
        error
      );
    }
  }

  // Income
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  // Expense
  const expense = transactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  // Balance
  const balance = income - expense;

  return (
    <div className="bg-slate-100 p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2">

            {/* Add Transaction */}
            <TransactionForm
              addTransaction={addTransaction}
            />

            {/* Edit Transaction */}
            {editingTransaction && (
              <form
                onSubmit={updateTransaction}
                className="bg-white rounded-xl shadow-md p-6 mt-6"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Edit Transaction
                </h2>

                {/* Title */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Title
                  </label>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(e.target.value)
                    }
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Amount
                  </label>

                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) =>
                      setEditAmount(e.target.value)
                    }
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Type */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Type
                  </label>

                  <select
                    value={editType}
                    onChange={(e) =>
                      setEditType(e.target.value)
                    }
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="income">
                      Income
                    </option>

                    <option value="expense">
                      Expense
                    </option>
                  </select>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Category
                  </label>

                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value)
                    }
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Update Transaction
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingTransaction(null)
                    }
                    className="bg-gray-200 px-5 py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right */}
          <div>
            {loading ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-500">
                  Loading transactions...
                </p>
              </div>
            ) : (
              <TransactionList
                title="Recent Transactions"
                transactions={transactions.slice(0, 5)}
                deleteTransaction={deleteTransaction}
                editTransaction={editTransaction}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;