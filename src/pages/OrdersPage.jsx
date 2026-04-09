import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetch('/api/orders')
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
    Delivered: '#3a7d44',
    Shipped:   '#185FA5',
    Processing:'#854F0B',
    Cancelled: '#A32D2D',
  };

  const allStatuses = ['All', ...new Set(orders.map(o => o.status).filter(Boolean))];

  const filtered = orders.filter(o => {
    const matchSearch =
      o._id?.toString().includes(search) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h2>Orders</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px' }}
        >
          {allStatuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f5f5f5' }}>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found</td></tr>
          ) : (
            filtered.map(o => (
              <tr key={o._id}>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                  #{o._id?.toString().slice(-6).toUpperCase()}
                </td>
                <td>{o.customerName || o.customer || '—'}</td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                <td>{o.items?.length ?? o.itemCount ?? '—'}</td>
                <td>${(o.total ?? o.totalAmount ?? 0).toFixed(2)}</td>
                <td>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: statusColors[o.status] + '22' || '#eee',
                    color: statusColors[o.status] || '#333',
                    fontWeight: 500
                  }}>
                    {o.status || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}