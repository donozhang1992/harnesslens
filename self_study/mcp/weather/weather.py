from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize MCP Server
mcp = FastMCP("weather", log_level="ERROR")

# constants
NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = "weather-app/1.0"

# Define the weather function
async def make_nws_request(url: str) -> dict[str, Any] | None:
    """Make a request to the NWS API with proper error handling."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json",
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None
        
def format_alert(feature: dict) -> str:
    """Format a single alert feature into a readable string."""
    properties = feature.get("properties", {})
    event = properties.get("event", "Unknown Event")
    severity = properties.get("severity", "Unknown Severity")
    description = properties.get("description", "No description available.")
    instructions = properties.get("instruction", "")
    return f"""
        Event: {event}
        Severity: {severity} 
        Description: {description}
        Instructions: {instructions}
    """
    
@mcp.tool()
async def get_weather_alerts(state: str) -> str:
    """Get weather alerts for a given state.
    Args:
        state (str): The two-letter state code (e.g., 'CA' for California).
    """
    url = f"{NWS_API_BASE}/alerts/active/area/{state.upper()}"
    data = await make_nws_request(url)
    
    if not data or "features" not in data:
        return f"Could not retrieve weather alerts for {state.upper()}."
    
    if not data["features"]:
        return f"No active weather alerts for {state.upper()}."
    
    alerts = [format_alert(feature) for feature in data["features"]]
    return "\n---\n".join(alerts)

@mcp.tool()
async def get_forecast(lat: float, lon: float) -> str:
    """Get the weather forecast for a given latitude and longitude.
    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.
    """
    url = f"{NWS_API_BASE}/points/{lat},{lon}"
    data = await make_nws_request(url)
    
    if not data or "properties" not in data or "forecast" not in data["properties"]:
        return f"Could not retrieve forecast for coordinates ({lat}, {lon})."
    
    forecast_url = data["properties"]["forecast"]
    forecast_data = await make_nws_request(forecast_url)
    
    if not forecast_data or "properties" not in forecast_data or "periods" not in forecast_data["properties"]:
        return f"Could not retrieve detailed forecast for coordinates ({lat}, {lon})."
    
    periods = forecast_data["properties"]["periods"]
    forecast = []
    for period in periods[:5]:  # Limit to the first 5 periods for brevity
        name = period.get("name", "Unknown Period")
        detailed_forecast = period.get("detailedForecast", "No forecast available.")
        forecast.append(f"""
                        period: {name}
                        Temperature: {period.get("temperature", "N/A")} {period.get("temperatureUnit", "")}
                        Wind: {period.get("windSpeed", "N/A")} {period.get("windDirection", "")}
                        Forecast: {detailed_forecast}
                        """)

    return "\n---\n".join(forecast)

if __name__ == "__main__":    mcp.run(transport='stdio') # mcp server和客户端通过标准输入输出通信