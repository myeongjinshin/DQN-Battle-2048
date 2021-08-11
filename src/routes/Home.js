import React from "react";

class Home extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }
    render() {
        return (
        <center>
            <div><h1>Home</h1></div>
        </center>
        );
    }
}

export default Home;