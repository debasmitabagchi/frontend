import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage    from './pages/OrdersPage';
import ProductsPage  from './pages/ProductsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold">E-Commerce Dashboard</Link>
              </div>
              <div className="flex space-x-4 items-center">
                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">Home</Link>
                <Link to="/products" className="hover:bg-blue-700 px-3 py-2 rounded">Products</Link>
                <Link to="/customers" className="hover:bg-blue-700 px-3 py-2 rounded">Customers</Link>
                <Link to="/orders" className="hover:bg-blue-700 px-3 py-2 rounded">Orders</Link>
                <Link to="/analytics" className="hover:bg-blue-700 px-3 py-2 rounded">Analytics</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;