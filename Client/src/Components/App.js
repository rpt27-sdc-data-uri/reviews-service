import React from "react";
import ReactDOM from "react-dom";
import "../../style/main.less";
import $ from 'jquery';
import ReviewBody from './reviewBody';
import SortBy from './sortBy';
import FilterBy from './filterBy';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {reviews: [], carouselReviews: [], };
    this.reviewGetter = this.reviewGetter.bind(this);
    this.carouselReviewsGetter = this.carouselReviewsGetter.bind(this);
    this.sortReviews = this.sortReviews.bind(this);
  }

  sortReviews (e) {
    if (e.target.value === 'mostHelpful') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        this.state.reviews.sort((a, b) => {
          return b.foundHelpful - a.foundHelpful;
        })
      }
      this.setState(this.state.reviews);
    } else if (e.target.value === 'mostRecent') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        this.state.reviews.sort((a, b) => {
          return Date.parse(b.date) - Date.parse(a.date);
        })
      }
      this.setState(this.state.reviews);
    }

    if (e.target.value === '5 star only') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        if (this.state.reviews[i].overallStars === 5) {
          this.state.reviews[i].display = true;
        } else {
          this.state.reviews[i].display = false;
        }
      }
      this.setState(this.state.reviews);
    } else if (e.target.value === '4 star only') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        if (this.state.reviews[i].overallStars === 4) {
          this.state.reviews[i].display = true;
        } else {
          this.state.reviews[i].display = false;
        }
      }
      this.setState(this.state.reviews);

    } else if (e.target.value === '3 star only') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        if (this.state.reviews[i].overallStars === 3) {
          this.state.reviews[i].display = true;
        } else {
          this.state.reviews[i].display = false;
        }
      }
      this.setState(this.state.reviews);

    } else if (e.target.value === '2 star only') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        if (this.state.reviews[i].overallStars === 2) {
          this.state.reviews[i].display = true;
        } else {
          this.state.reviews[i].display = false;
        }
      }
      this.setState(this.state.reviews);

    } else if (e.target.value === '1 star only') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        if (this.state.reviews[i].overallStars === 1) {
          this.state.reviews[i].display = true;
        } else {
          this.state.reviews[i].display = false;
        }
      }
      this.setState(this.state.reviews);

    } else if (e.target.value === 'All Stars') {
      for (let i = 0; i < this.state.reviews.length; i++) {
        this.state.reviews[i].display = true;
      }
      this.setState(this.state.reviews);
    }
  }

  reviewGetter () {
    $.ajax({
      url: "http://localhost:4000/reviews",
      data: {id: 2},
      method: 'POST',
      success: (data) => {
        for (let i = 0; i < data.length; i++) {
          let htmlReview = data[i].review.split('<br>');
          let htmlJoin = htmlReview.join("\n\n");
          data[i].review = htmlJoin;
        }
        for (let i = 0; i < data.length; i++) {
          data.sort((a, b) => {
            return b.foundHelpful - a.foundHelpful;
          })
        }
        this.setState({reviews: data});
      },
      error: (error) => {
        console.log('error', error);
      }
    })
  }
  carouselReviewsGetter () {
    $.ajax({
      url: "http://localhost:4000/reviews/carouselReviews",
      data: {ids: [1, 2, 3, 4, 5, 6, 7]},
      method: 'POST',
      success: (data) => {
        this.setState({carouselReviews: data})
      },
      error: (error) => {
        console.log('error', error);
      }
    })
  }

  componentDidMount() {
    this.reviewGetter();
    this.carouselReviewsGetter();
  }
  render() {
    return (
      <div className={"reviewsShell"}>
        <nav>
          <h2 className={"Audible"}>Audible.com Reviews</h2>
          <h2 className={"Amazon"}>Amazon.com Reviews</h2>
        </nav>
        <span className="greyBar">
          <hr></hr>
        </span>
        <div className="filters">
          <SortBy sortReviews={this.sortReviews}/>
          <FilterBy sortReviews={this.sortReviews}/>
        </div>
        <div>
          <ReviewBody className="reviewBody" reviews={this.state.reviews.slice(0, 20)} />
        </div>
        <button className="showMore">
          Show More
        </button>
      </div>
    );
  }
}

export default App;