// main.js
var React = require('react');
var ReactDOM = require('react-dom');

class YouShould extends React.Component {
    constructor() {
        super();
        this.state = { youshould: null };
        this.translateWeather = this.translateWeather.bind(this);
        this.translateTemperature = this.translateTemperature.bind(this);
    }

    translateWeather(type) {
      switch (type)  {
          case "Thunderstorm":
              return "Seems like there is a thunderstorm brewing."
          case "Rain":
              return "Raining, huh? Bring an umbrella."
          case "Drizzle":
              return "Some light rain today. Not too bad."
          default:
              return "Not sure what the weather is like, to be honest."
      }
    }

    // heck do I even need this stuff client side?
    translateTemperature(temp) {
        if (temp <= 30) {
            return temp + " degrees.  Pretty cold out.";
        } else if (temp < 65 && temp > 30) {
            return temp + " degrees. A little chilly.";
        } else if (temp <= 80 && temp >= 65) {
            return temp + " degrees.  Not too shabby.";
        } else if (temp >= 80) {
            return temp + " degrees.  Pretty hot outside.";
        }
        return "Not really sure what the temperature is.";
    }

    componentDidMount() {
        let req = new XMLHttpRequest();
        req.onreadystatechange =
            (function (req) {
                return () => {
                    if (req.readyState === XMLHttpRequest.DONE
                            && req.status === 200) {
                        this.setState({
                            youshould: JSON.parse(req.responseText)
                        })
                    }
                }
            }.bind(this))(req);
        let url = 'http://localhost:4000/api/getEvents'
        let params = '?date=' + encodeURIComponent(this.props.date.toString())
                    + '&latitude=' + encodeURIComponent(this.props.latitude)
                    + '&longitude=' + encodeURIComponent(this.props.longitude);
        req.open('GET',  url + params);
        req.send();
    }

    render() {
        if (this.state.youshould) {
            return (
              <div>
                <div>{this.translateWeather(this.state.youshould.weather.type)}</div>
                <div>{this.translateTemperature(this.state.youshould.weather.temperature)}</div>
                <div>You should go to the {this.state.youshould.event.title} at {this.state.youshould.event.start_time}.</div>
                <div>Here's what they have to say about themselves:</div>
                <div>{this.state.youshould.event.description}</div>
                <div>The address is: {this.state.youshould.event.address}</div>
                <div>Have fun!</div>
              </div>
            )
        } else {
            return <div> Let me see what there is to do today... </div>
        }
    }
}

// grabs some information to render some components
class InfoBox extends React.Component {
    constructor() {
        super();
        this.state = {
            pos: null
        }
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            self = this;
            navigator.geolocation.getCurrentPosition(function(pos) {
                self.setState({ pos: pos });
            });
        } else {
            self.setState({ pos: false });
        }
    }

    render() {
        if (this.state.pos) {
            return <YouShould latitude={this.state.pos.coords.latitude}
                longitude={this.state.pos.coords.longitude} date={new Date()}/>
        } else {
            return <div> Trying to find you... </div>
        }
    }
}

ReactDOM.render(
  <InfoBox />,
  document.getElementById('react-root')
);
