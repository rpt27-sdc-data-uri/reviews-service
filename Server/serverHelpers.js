const Promise = require('bluebird');
const db = require('../Database/mongoose/database.js');
const reviewCollection = db;


const reviewGetter = (req, res, id) => {

  if (res === undefined) {
    return;
  }
  return new Promise(async (resolve, reject) => {
    const data = require('../Database/mongoose/database.js');
    const review = data.Review;
    resolve(review);
  })
    .then((data) => {
      return new Promise(async (resolve, reject) => {
        data = await reviewCollection.find({ bookId: id });
        resolve(data);
      })
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            let reviewArray = data[i].review.split('\n');
            let review = reviewArray.join('<br>');
            data[i].review = review;
          }

          res.send(data);
        })
        .catch((error) => {
          res.setStatus(500)
          res.send(error);
        })
    })
    .catch((error) => {
      res.setStatus(500);
      res.send(error);
    })
}

const arrayOfIdsReviewGetter = (req, res, idArray) => {
  if (res === undefined) {
    return;
  }
  return new Promise(async (resolve, reject) => {
    const data = require('../Database/database.js');
    const review = data.Review;
    resolve(review);
  })
    .then((data) => {
      return new Promise(async (resolve, reject) => {
        data = await reviewCollection.find({ bookId: {$in: idArray} }, {bookId: true, reviewerName: true, title: true, date: true, overallStars: true, reviewTitle: true});
        resolve(data);
       })
        .then((data) => {
          const idsOfAlreadyLoggedBooks = {};
          const arrayOfRecommendedReviews = [];
          for (let i = 0; i < data.length; i++) {
            if (idsOfAlreadyLoggedBooks[data[i].bookId] === undefined) {
              arrayOfRecommendedReviews.push(data[i])
              idsOfAlreadyLoggedBooks[data[i].bookId] = 1;
            }
          }
          res.send(arrayOfRecommendedReviews);
        })
        .catch((error) => {
          res.setStatus(500);
          res.send(error);
        })
    })
    .catch((error) => {
      res.setStatus(500);
      res.send(error);
    })
}


module.exports.reviewGetter = reviewGetter;
module.exports.arrayOfIdsReviewGetter = arrayOfIdsReviewGetter;