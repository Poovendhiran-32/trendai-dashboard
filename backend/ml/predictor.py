import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings('ignore')

class TimeSeriesPredictor:
    """Time series prediction and analysis"""
    
    def __init__(self):
        self.model = None
        self.data = None
        self.date_column = None
        self.value_column = None
    
    def prepare_data(self, data: List[Dict[str, Any]], date_column: str, value_column: str) -> pd.DataFrame:
        """Prepare data for time series analysis"""
        df = pd.DataFrame(data)
        
        # Convert date column to datetime
        df[date_column] = pd.to_datetime(df[date_column])
        
        # Sort by date
        df = df.sort_values(date_column)
        
        # Set date as index
        df.set_index(date_column, inplace=True)
        
        # Ensure value column is numeric
        df[value_column] = pd.to_numeric(df[value_column], errors='coerce')
        
        # Remove NaN values
        df = df.dropna(subset=[value_column])
        
        self.data = df
        self.date_column = date_column
        self.value_column = value_column
        
        return df
    
    def detect_trend(self) -> Dict[str, Any]:
        """Detect trend in time series data"""
        if self.data is None or len(self.data) < 10:
            return {
                "direction": "stable",
                "strength": 0,
                "confidence": 0,
                "message": "Insufficient data for trend analysis"
            }
        
        try:
            # Perform seasonal decomposition
            decomposition = seasonal_decompose(
                self.data[self.value_column],
                model='additive',
                period=min(12, len(self.data) // 2)
            )
            
            trend = decomposition.trend.dropna()
            
            # Calculate trend direction
            trend_slope = np.polyfit(range(len(trend)), trend.values, 1)[0]
            
            # Normalize slope to get strength (0-100)
            max_value = self.data[self.value_column].max()
            min_value = self.data[self.value_column].min()
            value_range = max_value - min_value
            
            if value_range > 0:
                strength = min(100, abs(trend_slope / value_range) * 100 * len(trend))
            else:
                strength = 0
            
            # Determine direction
            if abs(trend_slope) < 0.01:
                direction = "stable"
            elif trend_slope > 0:
                direction = "up"
            else:
                direction = "down"
            
            # Calculate confidence based on R-squared
            from sklearn.metrics import r2_score
            trend_line = np.polyval([trend_slope, trend.values[0]], range(len(trend)))
            confidence = max(0, min(100, r2_score(trend.values, trend_line) * 100))
            
            return {
                "direction": direction,
                "strength": round(strength, 2),
                "confidence": round(confidence, 2),
                "slope": float(trend_slope),
                "message": f"Trend is {direction} with {confidence:.1f}% confidence"
            }
            
        except Exception as e:
            return {
                "direction": "stable",
                "strength": 0,
                "confidence": 0,
                "message": f"Error in trend detection: {str(e)}"
            }
    
    def seasonal_decomposition(self) -> Dict[str, Any]:
        """Perform seasonal decomposition"""
        if self.data is None or len(self.data) < 24:
            return {
                "hasSeasonality": False,
                "message": "Insufficient data for seasonal analysis (need at least 24 data points)"
            }
        
        try:
            # Determine period (try to detect automatically)
            period = min(12, len(self.data) // 2)
            
            decomposition = seasonal_decompose(
                self.data[self.value_column],
                model='additive',
                period=period
            )
            
            # Extract components
            trend = decomposition.trend.dropna()
            seasonal = decomposition.seasonal.dropna()
            residual = decomposition.resid.dropna()
            
            # Calculate seasonality strength
            seasonal_strength = (seasonal.std() / self.data[self.value_column].std()) * 100
            
            return {
                "hasSeasonality": seasonal_strength > 10,
                "strength": round(seasonal_strength, 2),
                "period": period,
                "trend": trend.tolist(),
                "seasonal": seasonal.tolist(),
                "residual": residual.tolist(),
                "dates": [d.isoformat() for d in trend.index],
                "message": f"Seasonal pattern detected with {seasonal_strength:.1f}% strength"
            }
            
        except Exception as e:
            return {
                "hasSeasonality": False,
                "message": f"Error in seasonal decomposition: {str(e)}"
            }
    
    def forecast_arima(self, periods: int = 30) -> Dict[str, Any]:
        """Forecast using ARIMA model"""
        if self.data is None or len(self.data) < 20:
            return {
                "success": False,
                "error": "Insufficient data for forecasting (need at least 20 data points)"
            }
        
        try:
            # Fit ARIMA model (using auto parameters for simplicity)
            # In production, use auto_arima from pmdarima
            model = ARIMA(self.data[self.value_column], order=(1, 1, 1))
            fitted_model = model.fit()
            
            # Forecast
            forecast = fitted_model.forecast(steps=periods)
            
            # Get confidence intervals
            forecast_df = fitted_model.get_forecast(steps=periods)
            confidence_intervals = forecast_df.conf_int()
            
            # Generate future dates
            last_date = self.data.index[-1]
            future_dates = pd.date_range(
                start=last_date + timedelta(days=1),
                periods=periods,
                freq='D'
            )
            
            # Prepare forecast data
            forecast_data = []
            for i, date in enumerate(future_dates):
                forecast_data.append({
                    "date": date.isoformat(),
                    "predicted": float(forecast.iloc[i]),
                    "lower": float(confidence_intervals.iloc[i, 0]),
                    "upper": float(confidence_intervals.iloc[i, 1])
                })
            
            # Calculate metrics
            historical_mean = self.data[self.value_column].mean()
            forecast_mean = forecast.mean()
            
            return {
                "success": True,
                "modelType": "ARIMA",
                "forecast": forecast_data,
                "metrics": {
                    "aic": float(fitted_model.aic),
                    "bic": float(fitted_model.bic),
                    "historicalMean": float(historical_mean),
                    "forecastMean": float(forecast_mean),
                    "percentChange": float(((forecast_mean - historical_mean) / historical_mean) * 100)
                },
                "parameters": {
                    "order": "(1,1,1)",
                    "periods": periods
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error in ARIMA forecasting: {str(e)}"
            }
    
    def generate_insights(self, trend_data: Dict[str, Any], forecast_data: Dict[str, Any], seasonal_data: Dict[str, Any]) -> List[str]:
        """Generate AI insights from analysis"""
        insights = []
        
        # Trend insights
        if trend_data.get("direction") == "up":
            insights.append(f"📈 Strong upward trend detected with {trend_data.get('confidence', 0):.1f}% confidence. Consider increasing inventory levels.")
        elif trend_data.get("direction") == "down":
            insights.append(f"📉 Downward trend detected with {trend_data.get('confidence', 0):.1f}% confidence. Review pricing strategy and marketing efforts.")
        else:
            insights.append("➡️ Stable trend detected. Maintain current inventory and operations.")
        
        # Seasonality insights
        if seasonal_data.get("hasSeasonality"):
            insights.append(f"🔄 Seasonal pattern identified with {seasonal_data.get('strength', 0):.1f}% strength. Plan inventory around seasonal peaks.")
        
        # Forecast insights
        if forecast_data.get("success"):
            metrics = forecast_data.get("metrics", {})
            percent_change = metrics.get("percentChange", 0)
            
            if percent_change > 10:
                insights.append(f"⚡ Forecast shows {percent_change:.1f}% increase. Prepare for higher demand.")
            elif percent_change < -10:
                insights.append(f"⚠️ Forecast shows {percent_change:.1f}% decrease. Adjust procurement accordingly.")
            else:
                insights.append("✅ Forecast indicates stable demand in the coming period.")
        
        # Data quality insights
        if self.data is not None:
            data_points = len(self.data)
            if data_points < 30:
                insights.append("⚠️ Limited historical data. Predictions will improve with more data points.")
            else:
                insights.append(f"✅ Good data quality with {data_points} historical data points.")
        
        return insights
    
    def analyze(self, data: List[Dict[str, Any]], date_column: str, value_column: str, forecast_periods: int = 30) -> Dict[str, Any]:
        """Complete analysis pipeline"""
        try:
            # Prepare data
            self.prepare_data(data, date_column, value_column)
            
            # Perform analyses
            trend_data = self.detect_trend()
            seasonal_data = self.seasonal_decomposition()
            forecast_data = self.forecast_arima(forecast_periods)
            
            # Generate insights
            insights = self.generate_insights(trend_data, forecast_data, seasonal_data)
            
            return {
                "success": True,
                "trend": trend_data,
                "seasonality": seasonal_data,
                "forecast": forecast_data,
                "insights": insights,
                "dataPoints": len(self.data),
                "dateRange": {
                    "start": self.data.index[0].isoformat(),
                    "end": self.data.index[-1].isoformat()
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error in analysis: {str(e)}"
            }