import { useState, useEffect, useRef } from 'react';
import { ApiService } from '../api/api-service';

export function useRealTimeData() {
  const [metrics, setMetrics] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = () => {
    try {
      const ws = ApiService.createWebSocketConnection();
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        
        // Subscribe to metrics updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          subscriptions: ['metrics']
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'metrics_update') {
            setMetrics({
              ...data.data,
              lastUpdate: new Date().toISOString()
            });
          } else if (data.type === 'alert') {
            setAlerts(prev => [data.data, ...prev.slice(0, 9)]); // Keep max 10 alerts
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
        setIsConnected(false);
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect');
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    // Initial metrics fetch
    const fetchInitialMetrics = async () => {
      try {
        const data = await ApiService.getMetrics(24);
        setMetrics({
          ...data,
          lastUpdate: new Date().toISOString()
        });
        // Set connected to true if we got data from API
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to fetch initial metrics:', err);
        setError('Failed to load initial data');
        // Still try to connect WebSocket for real-time updates
        connectWebSocket();
      }
    };

    fetchInitialMetrics();
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const clearAlerts = () => {
    setAlerts([]);
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return {
    metrics,
    isConnected,
    error,
    alerts,
    reconnect: connectWebSocket,
    clearAlerts,
    dismissAlert
  };
}
