import React, { useEffect, useState } from 'react';
import { productApi, categoryApi } from '../../api';

export const ProductsDebug: React.FC = () => {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const testAPI = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://ecommerce-blog-backend.onrender.com';
        setStatus(`Testing API endpoints at: ${apiUrl}...`);
        
        // Test products API
        const products = await productApi.getProducts();
        console.log('Products API response:', products);
        
        // Test categories API
        const categories = await categoryApi.getCategories();
        console.log('Categories API response:', categories);
        
        setStatus(`SUCCESS: Loaded ${Array.isArray(products) ? products.length : 'unknown'} products and ${Array.isArray(categories) ? categories.length : 'unknown'} categories from ${apiUrl}`);
      } catch (error) {
        console.error('API Error:', error);
        setStatus(`ERROR: ${error}`);
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>API Debug Status</h3>
      <p>{status}</p>
    </div>
  );
};
