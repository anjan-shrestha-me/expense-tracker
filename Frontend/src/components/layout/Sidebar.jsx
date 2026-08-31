import { FiHome, FiCreditCard, FiBarChart2, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile  Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6 flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header & Close Button */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                isActive ? "bg-emerald-600 text-white" : "hover:bg-gray-800"
              }`
            }
          >
            <FiHome size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transaction"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                isActive ? "bg-emerald-600 text-white" : "hover:bg-gray-800"
              }`
            }
          >
            <FiCreditCard size={20} />
            <span>Transaction</span>
          </NavLink>

          <NavLink
            to="/analytics"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                isActive ? "bg-emerald-600 text-white" : "hover:bg-gray-800"
              }`
            }
          >
            <FiBarChart2 size={20} />
            <span>Analytics</span>
          </NavLink>
        </nav>

        <div className="mt-auto pt-8 text-sm text-gray-400 border-t border-gray-700">
          © 2026 Expense Tracker
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
