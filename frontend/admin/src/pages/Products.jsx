// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [productName, setProductName] = useState('');
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL; // Ensure this environment variable is correctly set

  useEffect(() => {
    axios.get(`${backendURL}/products`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Unexpected data format');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        setLoading(false);
      });
  }, [backendURL]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    if (file) {
      formData.append('file', file); // Append the file
    }

    axios.post(`${backendURL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        setProducts([...products, response.data.file]); // Add new product
        setProductName('');
        setFile(null);
      })
      .catch(error => console.error('Error adding product:', error));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const renderImage = (filename) => {
    return `${backendURL}/image/${filename}`;
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Products</h1>

      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
        />
        <button type="submit">Add Product</button>
      </form>

      <ul>
        {products && products.length > 0 ? (
          products.map(product => (
            <li key={product._id}>
              <h2>{product.name}</h2>
              <img src={renderImage(product.filename)} alt={product.name} style={{ width: '100px', height: 'auto' }} />
              {/* Add more product details and controls here */}
            </li>
          ))
        ) : (
          <li>No products available.</li>
        )}
      </ul>
    </div>
  );
};

export default Products;

