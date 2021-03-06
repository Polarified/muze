import React, {Component} from "react";
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom"

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Router>
            <Switch>
                <Route exact path='/'><p>Home!</p></Route>
                <Route path={'/join'} component={JoinRoomPage}/>
                <Route path={'/create'} component={CreateRoomPage}/>
                <Route path={'/room/:roomCode'} component={Room}/>
            </Switch>
        </Router>)
    }
}