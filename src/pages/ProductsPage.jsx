import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Changed URL from 192.168.0.116 to localhost to match your backend port 5000
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading products from ecommerce_db...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Inventory</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            {/* Added Product ID column to match your database schema */}
            <th>Product ID</th> 
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              {/* Mapping p.product_id exactly as it appears in Compass */}
              <td style={{ padding: '8px' }}>{p.product_id}</td> 
              <td style={{ padding: '8px' }}>{p.name}</td>
              <td style={{ padding: '8px' }}>{p.category}</td>
              <td style={{ padding: '8px' }}>${p.price.toFixed(2)}</td>
              <td style={{ padding: '8px' }}>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}