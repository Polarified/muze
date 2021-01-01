import React, {Component} from 'react';
import {Grid, Button, Typography} from "@material-ui/core";
import { Link } from 'react-router-dom'

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        }
        this.roomCode = this.props.match.params.roomCode;
        this._getRoomDetails()
        this._leaveButtonPressed = this._leaveButtonPressed.bind(this);
    }

    _getRoomDetails() {
        fetch('/api/get?code=' + this.roomCode).then((response) => {
            if (!response.ok) {
                this.props.leaveRoomCallback();
                this.props.history.push('/');
            }
            return response.json()
        }).then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            })
        });
    }

    _leaveButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json"}
        };
        fetch('/api/leave', requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push('/');
        });
    }

    render() {
        return (
            <Grid container spacing={1} align={"center"}>
                <Grid item xs={12}>
                    <Typography variant={"h4"} component={"h4"}>
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={"h6"} component={"h4"}>
                        Votes: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={"h6"} component={"h4"}>
                        Guest Can Pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={"h6"} component={"h4"}>
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button variant={"contained"} color={"secondary"} onClick={this._leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
    )
    }
}