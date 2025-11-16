import { useState, useEffect } from 'react';
import { ApiService } from '../api/api-service';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchProducts = async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.getProducts({ ...params, ...newParams });
      
      setProducts(response.products || []);
      setTotal(response.total || 0);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  const getTopPerformers = (limit = 10) => {
    return products
      .sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0))
      .slice(0, limit)
      .map(product => ({
        ...product,
        predicted_demand: Math.round((product.sales_velocity || 0) * 30 * (1 + Math.random() * 0.5)),
        forecast_accuracy: Math.round(85 + Math.random() * 10),
        risk_level: (product.stock || 0) <= 10 ? 'high' : (product.stock || 0) <= 50 ? 'medium' : 'low'
      }));
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(params)]);

  return {
    products,
    loading,
    error,
    total,
    lastUpdate,
    refetch: fetchProducts,
    refreshProducts,
    getTopPerformers
  };
}
