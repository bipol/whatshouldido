// main.js
var React = require('react');
var ReactDOM = require('react-dom');

class YouShould extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
    }

    render() {
        return ( <div>{this.props.date.toString()} 
         {this.props.location ? String(this.props.location.coords.latitude) + ' ' + String(this.props.location.coords.longitude) : ''}</div> );
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
                console.log(pos);
                self.setState({ pos: pos });
            });
        } else {
            self.setState({ pos: false });
        }
    }

    render() {
        return <YouShould location={this.state.pos} date={new Date()}/>
    }
}

ReactDOM.render(
  <InfoBox />, 
  document.getElementById('react-root')
);


