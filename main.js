// main.js
var React = require('react');
var ReactDOM = require('react-dom');

class YouShould extends React.Component {
    constructor() {
        super();
        this.state = { youshould: null };
    }

    componentDidMount() {
        let req = new XMLHttpRequest();
        req.onreadystatechange =
            (function (req) {
                return () => {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        if (req.status === 200) {
                            this.setState({
                                youshould: req.responseText
                            })
                        }
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
            return ( <div>{this.state.youshould}</div> )
        } else {
            return null
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


