import React from "react";

class Home extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }
    render() {
        return (
        <div>
            <h1>Home</h1>
        </div>
        );
    }
}

export default Home;