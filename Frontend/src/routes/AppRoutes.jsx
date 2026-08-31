import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Transaction from "../pages/Transaction";
import Analytics from "../pages/Analytics";
import Budget from "../pages/Budget";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <Routes>

      {/* Login/Register */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main application */}
      <Route element={<MainLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/settings" element={<Settings />} />

      </Route>

    </Routes>
  );
}

export default AppRoutes;