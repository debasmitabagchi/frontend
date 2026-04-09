import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig'; // 1. Import your global URL

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        // 2. Use the central variable instead of localhost:5000
        fetch(`${API_BASE_URL}/orders`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load orders:', err);
                setLoading(false);
            });
    }, []);
  const statusColors = {
    delivered: '#388e3c',
    confirmed: '#1976d2',
    pending:   '#f57c00',
    cancelled: '#d32f2f',
  };

  const allStatuses = ['All', ...new Set(orders.map(o => o.status).filter(Boolean))];

  const filtered = orders.filter(o => {
    // These fields correctly match your MongoDB documents
    const matchSearch =
      o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <p style={{ padding: '24px' }}>Loading orders from ecommerce_db...</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h2>Orders</h2>
      <div style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
        <input
          type="text"
          placeholder="Search by order ID or customer ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px' }}>
          {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f5f5f5' }}>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Items Count</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No orders found</td></tr>
          ) : (
            filtered.map(o => (
              <tr key={o._id}>
                <td style={{ fontFamily: 'monospace' }}>{o.order_id}</td> {/* cite: image_9d1774.png */}
                <td>{o.customer_id}</td> {/* cite: image_9d1774.png */}
                <td>{o.items?.length ?? 0}</td>
                {/* total_amount is used exactly as stored in your cluster */}
                <td style={{ fontWeight: '600' }}>${(o.total_amount || 0).toFixed(2)}</td>
                <td>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                    background: (statusColors[o.status] || '#999') + '22',
                    color: statusColors[o.status] || '#999',
                    fontWeight: 500, textTransform: 'capitalize'
                  }}>
                    {o.status}
                  </span>
                </td>
                {/* order_date formatting */}
                <td>{o.order_date ? new Date(o.order_date).toLocaleDateString() : '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}