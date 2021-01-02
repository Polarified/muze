import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import {Link} from "react-router-dom"
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Collapse} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

export default class RoomPropertiesPage extends Component {

    static defaultProps = {
        guestCanPause: true,
        votesToSkip: 2,
        update: false,
        roomCode: null,
        updateCallback: () => {
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            responseMessage: "",
        };
        this._handleRoomButtonPressed = this._handleRoomButtonPressed.bind(this);
        this._handleUpdateButtonPressed = this._handleUpdateButtonPressed.bind(this);
        this._handleVotesChange = this._handleVotesChange.bind(this);
        this._handleGuestCanPauseChange = this._handleGuestCanPauseChange.bind(this);
        this._renderUpdateButtons = this._renderUpdateButtons.bind(this);
        this._renderCreateButtons = this._renderCreateButtons.bind(this);

    }

    _handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    _handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === 'true',
        });
    }

    _handleRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        };
        fetch('/api/create', requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.history.push('/room/' + data.code))
    }

    _handleUpdateButtonPressed() {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            })
        };
        fetch('/api/update', requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.setState({
                        responseMessage: "Room updated successfully!"
                    });
                } else {
                    this.setState({
                        responseMessage: "Room failed to update."
                    });
                }
                this.props.updateCallback();
            });
    }

    _renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color={'primary'} variant={'contained'} onClick={this._handleRoomButtonPressed}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color={'secondary'} variant={'contained'} to={'/'} component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>);
    }

    _renderUpdateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color={'primary'} variant={'contained'} onClick={this._handleUpdateButtonPressed}>
                        Update Room
                    </Button>
                </Grid>
            </Grid>);
    }

    render() {
        const title = this.props.update ? "Update Room" : "Create A Room"

        return <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={this.state.responseMessage !== ""}>
                    {this.state.responseMessage === "Room updated successfully!" ? (
                        <Alert severity={"success"} onClose={() => {this.setState({responseMessage: "",})}}>
                            {this.state.responseMessage}
                        </Alert>
                        ) : (
                        <Alert severity={"error"} onClose={() => {this.setState({responseMessage: "",})}}>
                            {this.state.responseMessage}
                        </Alert>
                        )
                    }
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component={"h4"} variant={"h4"}>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component={'fieldset'}>
                    <FormHelperText>
                        <div align={'center'}>
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this._handleGuestCanPauseChange}>
                        <FormControlLabel value={'true'} control={<Radio color={'primary'}/>} label={'Play/Pause'}
                                          labelPlacement={'bottom'}/>
                        <FormControlLabel value={'false'} control={<Radio color={'secondary'}/>} label={'No Control'}
                                          labelPlacement={'bottom'}/>
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={'true'} type={'number'} defaultValue={this.state.votesToSkip}
                               inputProps={{min: 1, style: {textAlign: 'center'},}} onChange={this._handleVotesChange}>
                        <FormHelperText>
                            <div align={'center'}>
                                Votes Required to Skip Song
                            </div>
                        </FormHelperText>
                    </TextField>
                </FormControl>
            </Grid>
            {this.props.update ? this._renderUpdateButtons() : this._renderCreateButtons()}
        </Grid>
    }
}


