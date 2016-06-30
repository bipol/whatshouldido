defmodule Youshould.Router do
    use Plug.Router
    
    plug :match
    plug :dispatch
    
    def start_link do
        {:ok, _} = Plug.Adapters.Cowboy.http(Youshould.Router, [])
    end

    # check the parameters to ensure they are okay
    def check_params(params) do
        resp = {:ok, params}
        if !Map.has_key?(params, "date") do
            resp = {:error, "Response must have date, latitude, and longitude"}
        end

        if !Map.has_key?(params, "latitude") do
            resp = {:error, "Response must have date, latitude, and longitude"}
        end

        if !Map.has_key?(params, "longitude") do
            resp = {:error, "Response must have date, latitude, and longitude"}
        end
        resp
    end

    def get_weather(lat, lon) do
        HTTPotion.get("api.openweathermap.org/data/2.5/weather", 
            query: %{lat: lat, lon: lon, APPID: Application.get_env(:youshould, :owm_api_key)})
    end

    # query params:
    # date/time : date time local to the user 
    # latitude : lat of user position
    # longitude: long of user position 
    get "/api/getEvents" do
        conn = fetch_query_params(conn)
        case check_params(conn.params) do 
            {:ok, _} ->
                resp = get_weather(conn.params["latitude"], conn.params["longitude"]).body
                conn 
                |> send_resp(200, resp)
            {:error, body} ->
                conn 
                |> send_resp(400, body) 
        end
    end

    match _ do 
        conn
        |> send_resp(404, "Nothing here.")
    end
end
