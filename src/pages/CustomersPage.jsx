import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetching from your local backend port
    fetch(`${API_BASE_URL}/customers`)
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load customers:', err);
        setLoading(false);
      });
  }, []);

  // Update filter to search using the customer_id field
  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_id?.toLowerCase().includes(search.toLowerCase()) 
  );

  if (loading) return <p style={{ padding: '24px' }}>Loading customers...</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '16px' }}>Customers</h2>
      <input
        type="text"
        placeholder="Search by ID, name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ 
          marginBottom: '24px', 
          padding: '10px', 
          width: '100%', 
          maxWidth: '400px',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />
      <div style={{ overflowX: 'auto' }}>
        <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ textAlign: 'left' }}>Customer ID</th>
              <th style={{ textAlign: 'left' }}>Name</th>
              <th style={{ textAlign: 'left' }}>Email</th>
              <th style={{ textAlign: 'left' }}>Phone</th>
              <th style={{ textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No customers found.</td>
              </tr>
            ) : (
              filtered.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                  {/* CRITICAL FIX: Ensure c.customer_id matches the field in image_9d1a21.png */}
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1976d2' }}>
                    {c.customer_id}
                  </td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {c.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}