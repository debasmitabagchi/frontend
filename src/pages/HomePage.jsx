import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';


export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        Promise.all([
            // 2. Use the central variable for all three calls
            fetch(`${API_BASE_URL}/products`).then(r => r.json()).catch(() => []),
            fetch(`${API_BASE_URL}/customers`).then(r => r.json()).catch(() => []),
            fetch(`${API_BASE_URL}/orders`).then(r => r.json()).catch(() => []),
        ]).then(([products, customers, orders]) => {
            const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
     
     
            setStats({
        products: products.length,
        customers: customers.length,
        orders: orders.length,
        revenue: totalRevenue.toFixed(2),
      });
      setLoading(false);
    });
  }, []);

  const cardStyle = {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '24px',
    textAlign: 'center',
    flex: '1',
    minWidth: '160px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  };

  if (loading) return <p style={{ padding: '24px' }}>Loading dashboard from ecommerce_db...</p>;

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ marginBottom: '8px' }}>Welcome to E-Commerce Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Here's a quick overview of your store performance.
      </p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1976d2' }}>{stats.products}</div>
          <div style={{ color: '#666', marginTop: '8px' }}>Total Products</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#388e3c' }}>{stats.customers}</div>
          <div style={{ color: '#666', marginTop: '8px' }}>Total Customers</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f57c00' }}>{stats.orders}</div>
          <div style={{ color: '#666', marginTop: '8px' }}>Total Orders</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#7b1fa2' }}>${stats.revenue}</div>
          <div style={{ color: '#666', marginTop: '8px' }}>Total Revenue</div>
        </div>
      </div>

      <div style={{
        background: '#fff', border: '1px solid #e0e0e0',
        borderRadius: '10px', padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ marginBottom: '16px' }}>Quick Links</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['Products', 'Customers', 'Orders', 'Analytics'].map(page => (
            <a key={page} href={`/${page.toLowerCase()}`} style={{
              padding: '10px 20px', background: '#1976d2', color: '#fff',
              borderRadius: '6px', textDecoration: 'none', fontWeight: '500'
            }}>{page}</a>
          ))}
        </div>
      </div>
    </div>
  );
}