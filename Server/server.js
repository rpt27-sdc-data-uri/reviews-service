const express = require('express');
const app = express();
const path = require('path');
const port = 4001;
app.use('/books/:id', express.static(path.join(__dirname, '..', 'dist')));
const db = require('../Database/database.js');
const reviewCollection = db.Review;
const Promise = require('bluebird');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const reviewGetter = require('./serverHelpers').reviewGetter;
const arrayOfIdsReviewGetter = require('./serverHelpers').arrayOfIdsReviewGetter;
const AmpOptimizerMiddleware = require('@ampproject/toolbox-optimizer-express');

app.use('/books/:id/reviews', AmpOptimizerMiddleware.create());


//______This route returns all reviews on page load.
//______It returns {reviewerName: String,reviewerId: Number,review: String,urlString: String,bookName: String,bookId: Number,date: Date,overallStars: Number,performanceStars: Number,storyStars: Number,title: String,foundHelpful: Number,source: String, location: String}
//______This route fires on page load since this is a route integral to the initial structure of the page
app.get('/books/:id/reviews', (req, res) => {
  const id = req.params.id;
  res.set({"Cache-Control": "public", 'Access-Control-Allow-Origin': '*'})
  reviewGetter(req, res, id);
});

//_____This route returns reviews for carousel data such as when one wants review data for recommended books and related books.
//_____It takse in an object formatted with book ids as the key {ids: [1, 2, 3, etc.]}
//_____This will return an array of objects with: bookId, reviewTitle, reviewerName, and reviewData.
app.post('/reviews/carouselReviews', (req, res) => {
  let idArray = req.body.ids;
  res.set({'Access-Control-Allow-Origin': '*'})
  arrayOfIdsReviewGetter(req, res, idArray)
})

//GET

//POST
app.post('/create', (req, res) => {
  console.log('marcelo post')
  db.insertDocument()
  res.send('document created')
})

//UPDATE
app.put('/update', (req, res) => {
  console.log('marcelo put');
  db.updateDocument();
  res.send('document updated')
})

//DELETE
app.delete('/delete', (req, res) => {
  console.log('marcelo delete')
  db.deleteDocument();
  res.send('document deleted')
})

 // error handler middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something Broke!");
 })

 app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})

