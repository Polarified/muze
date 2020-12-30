import React, {Component} from "react";
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core'
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
        this.state = {
            roomCode: null,
        }
    }

    async componentDidMount() {
        fetch('/api/user')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.code
                })
            });
    }

    renderHomePage() {
        return (
            <Grid container align={"center"} spacing={3}>
                <Grid item xs={12}>
                    <Typography variant={"h3"} component={"h3"}>
                        Muze
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup disableElevation variant={"contained"} color={"primary"}>
                        <Button color={"primary"} to={"/join"} component={Link}>
                            Join a Room
                        </Button>
                        <Button color={"secondary"} to={"/create"} component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render() {
        return (<Router>
            <Switch>
                <Route exact path='/' render={() => {
                    return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`}/>) : this.renderHomePage()
                }}/>
                <Route path={'/join'} component={JoinRoomPage}/>
                <Route path={'/create'} component={CreateRoomPage}/>
                <Route path={'/room/:roomCode'} component={Room}/>
            </Switch>
        </Router>)
    }
}