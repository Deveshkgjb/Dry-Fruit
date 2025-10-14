import React, { useState, useEffect } from 'react';
import config, { initializeConfig } from '../config/environment.js';

const ComboDebugger = () => {
  const [debugInfo, setDebugInfo] = useState('Initializing...');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const runDebug = async () => {
      try {
        await initializeConfig();
        const apiUrl = config.API_BASE_URL;
        setDebugInfo(`API URL: ${apiUrl}`);
        
        // Test direct fetch
        const response = await fetch(`${apiUrl}/products`);
        if (response.ok) {
          const data = await response.json();
          const allProducts = data.products || [];
          setProducts(allProducts);
          
          // Apply filtering
          const valueComboProducts = allProducts.filter(product => {
            const isValueCombo = product.isValueCombo === true;
            const hasValueComboSection = product.displaySections?.valueCombos === true;
            const hasValueComboTag = product.tags && product.tags.some(tag => 
              tag.toLowerCase().includes('value') || tag.toLowerCase().includes('combo')
            );
            const isComboCategory = product.categorySlug === 'combos' || 
                                  product.category?.name?.toLowerCase().includes('combo');
            
            return isValueCombo || hasValueComboSection || hasValueComboTag || isComboCategory;
          });
          
          setFilteredProducts(valueComboProducts);
          setDebugInfo(`✅ Found ${allProducts.length} total products, ${valueComboProducts.length} value combos`);
        } else {
          setDebugInfo(`❌ API Error: ${response.status}`);
        }
      } catch (error) {
        setDebugInfo(`❌ Error: ${error.message}`);
      }
    };
    
    runDebug();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4ade80' }}>🔍 Combo Debugger</h4>
      <div style={{ marginBottom: '10px' }}>{debugInfo}</div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Total Products:</strong> {products.length}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Value Combos:</strong> {filteredProducts.length}
      </div>
      
      {filteredProducts.length > 0 && (
        <div>
          <strong>Combo Products:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
            {filteredProducts.map((product, index) => (
              <li key={index} style={{ fontSize: '11px' }}>
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          backgroundColor: '#4ade80',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        Refresh
      </button>
    </div>
  );
};

export default ComboDebugger;


