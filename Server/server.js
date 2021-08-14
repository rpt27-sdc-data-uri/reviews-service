const express = require('express');
const app = express();
const path = require('path');
const port = 4001;
//app.use('/books/:id/reviews', express.static(path.join(__dirname, '..', 'dist')));
app.use('/books/:id/', express.static(path.join(__dirname, '..', 'dist')));

//const db = require('../Database/database.js');
const mongoDb = require('../Database/mongo/index.js');
const postgres = require('../Database/sql/index.js');
//const reviewCollection = db.Review;
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
app.get('/books/:id/reviews', async (req, res) => {
  const id = req.params.id;
  res.set({"Cache-Control": "public", 'Access-Control-Allow-Origin': '*'})
  let reviews = await postgres.getDocumentSQL(id)
  //console.log('reviews', reviews, id)
  res.send(reviews)
});

//_____This route returns reviews for carousel data such as when one wants review data for recommended books and related books.
//_____It takse in an object formatted with book ids as the key {ids: [1, 2, 3, etc.]}
//_____This will return an array of objects with: bookId, reviewTitle, reviewerName, and reviewData.
app.post('/reviews/carouselReviews', (req, res) => {
  let idArray = req.body.ids;
  console.log('marcelo get')
  res.set({'Access-Control-Allow-Origin': '*'})
  arrayOfIdsReviewGetter(req, res, idArray)
})

//API Extension - Marcelo Yates

//GET
app.get('/benchmark/get/', async (req, res) => {
  console.log('marcelo get')
  // const id = req.params.id;
  let reviews = await postgres.getDocumentSQL(req.body.id)

  // //let review = await mongoDb.getDocumentMongo(100000)
  res.status(200).send(reviews);
});

//POST
app.post('/benchmark/post', async (req, res) => {
  //console.log('marcelo post', req.body)
  let review = Object.values(req.body)
  console.log('server reviews', req.body)
  await postgres.insertDocumentSQL(review)
  res.status(200).send(req.body);
})

//UPDATE
app.put('/benchmark/update', async (req, res) => {
  console.log('marcelo put');
  await postgres.updateDocumentSQL(req.body.test)
  res.status(200).send('document updated');
})

//DELETE
app.delete('/benchmark/delete', async (req, res) => {
  console.log('marcelo delete')
  await postgres.deleteDocumentSQL(req.body.id)
  res.status(200).send('document deleted');
})

 // error handler middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something Broke!");
 })

 app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})

