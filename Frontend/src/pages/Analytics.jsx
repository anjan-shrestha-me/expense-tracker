import { useState } from "react";
import SummaryCard from "../components/cards/SummaryCard";

function Analytics() {
  const [transactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const income = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expense;

  const totalTransactions = transactions.length;

  return (
    <div className="bg-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-8 ">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

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
    </div>



  );
}

export default Analytics;