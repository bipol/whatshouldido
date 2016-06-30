defmodule Youshould.Utils do

    # check the parameters to ensure they are okay
    def check_params(params) do
        case params do
            %{"date" => _, "latitude" => _, "longitude" => _} -> {:ok, params}
            _ -> {:error, "Response must have date, latitude, and longitude, received: #{params}"}
        end
    end

    def get_weather(lat, lon) do
        HTTPotion.get("api.openweathermap.org/data/2.5/weather", 
            query: %{lat: lat, lon: lon, APPID: Application.get_env(:youshould, :owm_api_key)})
    end

end
