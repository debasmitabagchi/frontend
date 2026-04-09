import { useState, useEffect } from 'react';

// Using localhost to match your backend port 5000 as seen in your terminal
const API = 'http://localhost:5000';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/products`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/customers`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/orders`).then(r => r.json()).catch(() => []),
    ]).then(([products, customers, orders]) => {
      // Correctly using total_amount from your MongoDB orders collection
      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      
      // Filtering based on the 'status' field in your database
      const delivered  = orders.filter(o => o.status === 'delivered').length;
      const confirmed  = orders.filter(o => o.status === 'confirmed').length;
      const pending    = orders.filter(o => o.status === 'pending').length;
      const cancelled  = orders.filter(o => o.status === 'cancelled').length;
      
      const avgOrder   = orders.length ? (totalRevenue / orders.length).toFixed(2) : '0.00';
      
      setData({ products, customers, orders, totalRevenue, delivered, confirmed, pending, cancelled, avgOrder });
      setLoading(false);
    });
  }, []);

  const statCard = (label, value, color) => (
    <div style={{
      background: '#fff', border: '1px solid #e0e0e0', borderRadius: '10px',
      padding: '20px 24px', flex: '1', minWidth: '180px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ color: '#666', marginTop: '6px', fontSize: '14px' }}>{label}</div>
    </div>
  );

  const barRow = (label, value, max, color) => (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
        <span>{label}</span>
        <span style={{ fontWeight: '500' }}>{value}</span>
      </div>
      <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '10px' }}>
        <div style={{
          width: max ? `${(value / max) * 100}%` : '0%',
          background: color, borderRadius: '4px', height: '10px',
          transition: 'width 0.6s ease'
        }} />
      </div>
    </div>
  );

  if (loading) return <p style={{ padding: '24px' }}>Loading analytics from ecommerce_db...</p>;

  const maxOrders = Math.max(data.delivered, data.confirmed, data.pending, data.cancelled, 1);

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>Analytics</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Store performance overview</p>

      {/* Main Stats Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {statCard('Total Revenue',     `$${data.totalRevenue.toFixed(2)}`, '#7b1fa2')}
        {statCard('Total Orders',      data.orders.length,                 '#1976d2')}
        {statCard('Avg Order Value',   `$${data.avgOrder}`,                '#f57c00')}
        {statCard('Total Customers',   data.customers.length,              '#388e3c')}
        {statCard('Total Products',    data.products.length,               '#d32f2f')}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Orders by Status Chart */}
        <div style={{
          flex: '1', minWidth: '300px', background: '#fff',
          border: '1px solid #e0e0e0', borderRadius: '10px',
          padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>Orders by Status</h2>
          {barRow('Delivered',  data.delivered,  maxOrders, '#388e3c')}
          {barRow('Confirmed',  data.confirmed,  maxOrders, '#1976d2')}
          {barRow('Pending',    data.pending,    maxOrders, '#f57c00')}
          {barRow('Cancelled',  data.cancelled,  maxOrders, '#d32f2f')}
        </div>

        {/* Store Summary List */}
        <div style={{
          flex: '1', minWidth: '300px', background: '#fff',
          border: '1px solid #e0e0e0', borderRadius: '10px',
          padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>Store Summary</h2>
          {[
            ['Total products in catalog',   data.products.length],
            ['Total registered customers',  data.customers.length],
            ['Orders placed',               data.orders.length],
            ['Orders delivered',            data.delivered],
            ['Orders confirmed',            data.confirmed],
            ['Orders pending',              data.pending],
            ['Orders cancelled',            data.cancelled],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px'
            }}>
              <span style={{ color: '#555' }}>{label}</span>
              <span style={{ fontWeight: '600' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}