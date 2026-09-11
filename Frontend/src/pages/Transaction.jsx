import { useState, useEffect } from "react";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";
// import TransactionSummary from "../components/transactions/TransactionSummary";
// import Pagination from "../components/transactions/Pagination";

function Transaction() {
  console.log("Transaction component loaded");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [category, setCategory] = useState("All Categories");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);

  //GET transactions from MongoDB
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
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

        console.log("Backend response:", data);

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setTransactions(data.data);
      } catch (error) {
        console.error(
          "Failed to fetch transactions:",
          error
        );
      }
    };

    fetchTransactions();
  }, []);
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.category
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesType =
      type === "All Types" || transaction.type === type;

    const matchesCategory =
      category === "All Categories" ||
      transaction.category === category;

    // Safely check if transaction.date exists and is valid before converting to ISO string
    let transactionDateString = "";
    if (transaction.date) {
      const parsedDate = new Date(transaction.date);
      // Check if parsedDate is a valid date (not NaN)
      if (!isNaN(parsedDate.getTime())) {
        transactionDateString = parsedDate.toISOString().split("T")[0];
      }
    }

    // If no date filter selected (date === ""), match all. Otherwise compare strings.
    const matchesDate = date === "" || transactionDateString === date;

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const sortedTransactions = [...filteredTransactions];
  if (sort === "Newest First") {
    sortedTransactions.sort((a, b) => b.id - a.id);
  } else if (sort === "Oldest First") {
    sortedTransactions.sort((a, b) => a.id - b.id);
  } else if (sort === "Highest Amount") {
    sortedTransactions.sort((a, b) => b.amount - a.amount);
  } else if (sort === "Lowest Amount") {
    sortedTransactions.sort((a, b) => a.amount - b.amount);
  }

  const totalTransactions = filteredTransactions.length;
  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = filteredTransactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  function deleteTransaction(id) {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction._id !== id
    );

    setTransactions(updatedTransactions);
  }
  const transactionsPerPage = 10;
  const indexOfLastTransaction =
    currentPage * transactionsPerPage;

  const indexOfFirstTransaction =
    indexOfLastTransaction - transactionsPerPage;

  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(
    sortedTransactions.length / transactionsPerPage
  );
  return (
    <div className=" bg-slate-100 p-8">

      <TransactionFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        category={category}
        setCategory={setCategory}
        date={date}
        setDate={setDate}
        sort={sort}
        setSort={setSort}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">

        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-gray-500 text-sm">Total</h3>
          <p className="text-3xl font-bold">{totalTransactions}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-gray-500 text-sm">Income</h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalIncome}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-gray-500 text-sm">Expense</h3>
          <p className="text-3xl font-bold text-red-600">
            ${totalExpense}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-gray-500 text-sm">Balance</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${totalIncome - totalExpense}
          </p>
        </div>

      </div>

      <TransactionList
        title="All Transactions"
        transactions={currentTransactions}
        deleteTransaction={deleteTransaction}
      />
      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Transaction;