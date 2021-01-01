import React, {Component} from 'react';
import {Grid, Button, Typography} from "@material-ui/core";
import {Link} from 'react-router-dom'
import RoomPropertiesPage from "./RoomPropertiesPage";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
        }
        this.roomCode = this.props.match.params.roomCode;
        this._getRoomDetails()
        this._leaveButtonPressed = this._leaveButtonPressed.bind(this);
        this._updateShowSettings = this._updateShowSettings.bind(this);
        this._renderSettingsButton = this._renderSettingsButton.bind(this);
        this._renderSettings = this._renderSettings.bind(this);
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
            headers: {"Content-Type": "application/json"}
        };
        fetch('/api/leave', requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push('/');
        });
    }

    _updateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    }

    _renderSettings() {
        return (<Grid container align={"center"}>
            <Grid item xs={12}>
                <RoomPropertiesPage
                    update={true}
                    votesToSkip={this.state.votesToSkip}
                    guestCanPause={this.state.guestCanPause}
                    roomCode={this.roomCode}
                    updateCallback={ null }
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant={"contained"} color={"secondary"} onClick={() => this._updateShowSettings(false)}>
                    Close
                </Button>
            </Grid>

        </Grid>);
    }

    _renderSettingsButton() {
        return (
            <Grid item xs={12}>
                <Button variant={"contained"} color={"primary"} onClick={() => this._updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    render() {
        if (this.state.showSettings) {
            return this._renderSettings();
        }
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
                    {this.state.isHost ? this._renderSettingsButton() : null}
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