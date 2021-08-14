// const Faker = require ('faker');
// const LoremIpsum = require("lorem-ipsum").LoremIpsum;

// const mongoose = require('mongoose');
// //mongoose.connect('mongodb://localhost/sdc', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('We\'re Connected!')

// });
// const reviewSchema = new mongoose.Schema({
//   reviewerName: String,
//   reviewerId: Number,
//   review: String,
//   urlString: String,
//   bookTitle: String,
//   bookId: Number,
//   date: Date,
//   overallStars: Number,
//   performanceStars: Number,
//   storyStars: Number,
//   reviewTitle: String,
//   foundHelpful: Number,
//   source: String,
//   location: String
// });

// module.exports = mongoose.model('Review', reviewSchema);

//MY
//const Review = mongoose.model('Review', reviewSchema)

//API Extension - Marcelo Yates

//Create single document
// function insertDocument() {

//   const newReview = new Review (
//     {
//       reviewerName: Faker.name.findName(),
//       reviewerId: Faker.datatype.number(),
//       review: Faker.lorem.paragraph(),
//       urlString: Faker.lorem.word(),
//       bookTitle: Faker.lorem.sentence(),
//       bookId: Faker.datatype.number(),
//       date: Faker.date.past(),
//       overallStars: Faker.datatype.number(),
//       performanceStars: Faker.datatype.number(),
//       storyStars: Faker.datatype.number(),
//       reviewTitle: Faker.lorem.words(),
//       foundHelpful: Faker.datatype.number(),
//       source: Faker.lorem.word(),
//       location: Faker.lorem.words()
//     }
//   )

//   newReview.save(function (err, newReview) {
//     if (err) {
//       return console.error(err);
//     } else {
//       console.log('doc saved!', newReview)
//     }
//   });
// }

// function deleteDocument(id) {
//   Review.deleteOne({_id: id}, function (err) {
//     if (err) {
//       return err;
//     } else {
//       console.log('doc deleted')
//     }
//   })
// }

// function updateDocument() {
//   //id, review, overallStars

//   Review.findOneAndUpdate({_id: '60d5535235d68d0f7b6254aa'}, { "$set": { "review": "testing review field again", "overallStars": 3}}).exec(function (err) {
//     if (err) {
//       console.log('err', err);
//     } else {
//       console.log('doc updated')
//     }
//   })
// }

// module.exports = {
//   insertDocument: insertDocument,
//   deleteDocument: deleteDocument,
//   updateDocument: updateDocument
// };

