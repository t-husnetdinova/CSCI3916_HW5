import React, { Component }  from 'react';
import {connect} from "react-redux";
import {
    Glyphicon,
    Panel,
    ListGroup,
    ListGroupItem,
    Form,
    FormGroup,
    Col,
    ControlLabel,
    FormControl, Button
} from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";

//support routing by creating a new component
class Review extends Component {

    constructor(props) {
        super(props);
        this.updateDetails = this.updateDetails.bind(this);
        this.writeReview = this.writeReview.bind(this);

        this.state = {
            details:{
                rating: 1,
                quote: ''
            }
        }
    }

    writeReview() {
        let reviewParams =
            {
              'movie_title': this.props.title,
              'rating': this.state.details.rating,
              'quote': this.state.details.quote
            };

        let bodyParams = [];
        for(let key in reviewParams)
        {
            let encodedKey = encodeURIComponent(key);
            let encodedVal = encodeURIComponent(reviewParams[key]);
            bodyParams.push(encodedKey + "=" + encodedVal);
        }

        bodyParams = bodyParams.join("&");


        return fetch('https://csci3916-hw4-husnetdinova.herokuapp.com/reviews',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-urlencoded',
                        'Authorization': localStorage.getItem('token')
                    },
                body: bodyParams
            })

            .then(response =>
                {
                    console.log("response: " +JSON.stringify(response));
                    console.log("status: " + response.statusText)
                })
            .then((res) =>
            {
                console.log("res: " +JSON.stringify(res));
            })
    }

    updateDetails(event){
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({
            details: updateDetails
        });
    }

    render(){
        return (
            <Form horizontal>
                <FormGroup controlId="rating">
                    <Col componentClass={ControlLabel} sm={2}>
                        Rating
                    </Col>
                    <Col sm={10}>
                        <FormControl onChange={this.updateDetails} value={this.state.details.rating} type="number" min="1" max="5"/>
                    </Col>
                </FormGroup>

                <FormGroup controlId="quote">
                    <Col componentClass={ControlLabel} sm={2}>
                        Review
                    </Col>
                    <Col sm={10}>
                        <FormControl onChange={this.updateDetails} value={this.state.details.quote} type="text" placeholder="Write your review here" />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button onClick={this.writeReview}>Post review</Button>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

class Movie extends Component {

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null)
            dispatch(fetchMovie(this.props.movieId));
    }

    render() {
        const ActorInfo = ({actors}) => {
            return (
                actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.ActorName}</b> {actor.ActorCharacter}
                </p>
                )
            );
        };

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                <b>{review.reviewer_id}</b> {review.quote}
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            );
        }

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { // evaluates to true if currentMovie is null
                return <div>Loading...</div>;
            }
            return (
                <Panel>
                    <Panel.Heading>Movie Detail</Panel.Heading>
                    <Panel.Body><Image className="image" src={currentMovie.image} thumbnail /></Panel.Body>
                    <ListGroup>
                        <ListGroupItem className="movieTitle">{currentMovie.title}</ListGroupItem>
                        <ListGroupItem className="headers">{"Cast"}</ListGroupItem>
                        <ListGroupItem className="actors"><ActorInfo actors={currentMovie.actor} /></ListGroupItem>
                        <ListGroupItem className="headers">{"Average rating"}</ListGroupItem>
                        <ListGroupItem><h4><Glyphicon glyph={'star'} /> {currentMovie.avgRating} </h4></ListGroupItem>
                    </ListGroup>
                    <ListGroupItem><Panel.Body><Review movieTitle={currentMovie.title} /></Panel.Body></ListGroupItem>
                    <ListGroupItem className="headers">{"Reviews"}</ListGroupItem>
                    <Panel.Body className="reviews"><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>
                </Panel>
            );
        };
        return (
            <DetailInfo currentMovie={this.props.selectedMovie} />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));