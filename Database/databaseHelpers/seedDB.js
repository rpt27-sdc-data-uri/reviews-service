const Review = require ('../database.js');
const Faker = require ('faker');
const randomDate = require('./seedDBHelperFunctions').randomDate;
const imageGetterFunction  = require('../../S3_Access/imagesObject.js').imageGetter;
const randomImage = require('./seedDBHelperFunctions').randomImage;
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const db = require('../database.js');
var file = require('file-system');
var fs = require('fs');
const {performance} = require('perf_hooks');
const csvWriter = require('csv-write-stream')

const writer = csvWriter({headers: ["reviewerName", "reviewerId", "review" , "urlString" , "bookId" , "date" , "overallStars" , "performanceStars", "storyStars" , "reviewTitle" , "foundHelpful" , "source" , "location"]})

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

var Promise = require("bluebird");

// function seedDatabase() {
//   return new Promise(function (resolve, reject) {
//     imageGetterFunction(resolve);
//   })
//   .then(async (data) => {
//     writer.pipe(fs.createWriteStream('reviews.csv'))
//     let imageObj = data;
//     const dbObject = {};


//     for (let i = 0; i < 2; i++) {
//       const reviewCount = Math.floor(15 * Math.random());
//       for (j = 0; j < 5; j++) {
//         const reviewObject = {};
//         //book id
//         let bookId = i;
//         reviewObject.bookId = i;
//         //review id
//         let reviewerId = Math.floor(100 * Math.random());
//         reviewObject.reviewerId = reviewerId;
//         //reviewer name
//         let name = Faker.name.findName();
//         let reviewerName
//         let imageUrl = randomImage(imageObj);
//         if (dbObject[reviewerId] === undefined) {
//           reviewObject.reviewerName = name;
//           dbObject[reviewerId] = name;
//           reviewerName = name;
//         } else {
//           reviewObject.reviewerName = dbObject[reviewerId];
//           reviewerName = dbObject[reviewerId]
//         }
//         //url string
//         let urlString = 'imageUrl' + reviewerId.toString();
//         if (dbObject[urlString] === undefined) {
//           dbObject[urlString] = imageUrl;
//           reviewObject.urlString = imageUrl;
//           urlString = dbObject[urlString];

//         } else {
//           reviewObject.urlString = dbObject[urlString];
//           urlString = dbObject[urlString]
//         }
//         //overall, story, and performance stars
//         let overallStars = Math.floor(Math.random() * 5) + 1;

//         function randomIntFromInterval(min, max) {
//           return Math.floor(Math.random() * (max - min + 1) + min);
//         }

//         let storyStars = randomIntFromInterval((overallStars - 2) , (overallStars + 2));
//         let performanceStars = randomIntFromInterval((overallStars - 1), (overallStars + 2));

//         if (storyStars < 1) {
//           storyStars = 1;
//         }
//         if (storyStars > 5) {
//           storyStars = 5;
//         }

//         if (performanceStars < 1) {
//           performanceStars = 1;
//         }
//         if (performanceStars > 5) {
//           performanceStars = 5;
//         }

//         reviewObject.overallStars = overallStars;
//         reviewObject.storyStars = storyStars;

//         reviewObject.performanceStars = performanceStars;
//         //date
//         let date = randomDate(new Date(2015, 0, 1), new Date());
//         reviewObject.date = date;

//         //found helpful
//         let foundHelpful = Math.floor(Math.random() * 100);
//         reviewObject.foundHelpful = foundHelpful;
//         //source
//         let source;
//         if(foundHelpful % 10 === 0) {
//           reviewObject.source = 'Amazon';
//           source = 'Amazon'

//         } else {
//           reviewObject.source = 'Audible';
//           source = 'Audible'
//         }
//         //location
//         let location;
//         if (foundHelpful % 5 === 0) {
//           reviewObject.location = 'Canada';
//           location = 'Canada'
//         } else {
//           reviewObject.location = 'United States';
//           location = 'United States'
//         }
//         //review
//         let review;
//         let numberOfParagraphs = Math.floor(Math.random() * 3) + 1;
//         let numberOfSentences = Math.floor(Math.random() * 7) + 1;
//         let conditional = Math.random() * 5;
//         if (conditional < 4) {
//           reviewObject.review = lorem.generateParagraphs(numberOfParagraphs);
//           review = lorem.generateParagraphs(numberOfParagraphs);
//         } else {
//           reviewObject.review = lorem.generateSentences(numberOfSentences);
//           review = lorem.generateParagraphs(numberOfSentences)
//         }
//         //review title
//         let reviewTitle;
//         let numberOfWords = Math.floor(Math.random() * 6);
//         reviewObject.reviewTitle = lorem.generateWords(numberOfWords);
//         reviewTitle = lorem.generateWords(numberOfWords);
//         // console.log('name' , reviewerName)
//         // console.log('reviewer id', reviewerId)
//         // console.log('review', review)
//         // console.log('url string', urlString)
//         // console.log('book id', bookId)
//         // console.log('date', date)
//         // console.log('overall star', overallStars)
//         // console.log('performance', performanceStars)
//         // console.log('storystars', storyStars)
//         // console.log('review title', reviewTitle)
//         // console.log('helpful', foundHelpful)
//         // console.log('source', source)
//         // console.log('location', location)

//         await writer.write({reviewerName, reviewerId, review , urlString , bookId , date , overallStars , performanceStars, storyStars , reviewTitle , foundHelpful , source , location});
//       }
//       console.log('seeded book id ' + i)
//     }
//     writer.end()
//   })
//   .then(() => {
//     console.log('seeding complete')
//   })
//   .catch((err) => {
//     console.log(err);
//   })
// }

function seedDatabase() {
  return new Promise(function (resolve, reject) {
    imageGetterFunction(resolve);
  })
  .then(async (data) => {
    console.log("begin seeding");
    let t0 = performance.now()
    let imageObj = data;
    const dbObject = {};
    let increment = 500000;
    let start = 0;
    let end = 500000;

    async function reviewCreator(start, end) {
      if(end <= 10000000) {

        for (let i = start; i < end; i++) {
          const reviewCount = Math.floor(10 * Math.random());
          for (j = 0; j < reviewCount; j++) {
            //book id
            let bookId = i;
            //review id
            let reviewerId = Math.floor(100 * Math.random());
            //reviewer name
            let name = Faker.name.findName();
            let reviewerName
            let imageUrl = randomImage(imageObj);
            if (dbObject[reviewerId] === undefined) {
              dbObject[reviewerId] = name;
              reviewerName = name;
            } else {
              reviewerName = dbObject[reviewerId]
            }
            //url string
            let urlString = 'imageUrl' + reviewerId.toString();
            if (dbObject[urlString] === undefined) {
              dbObject[urlString] = imageUrl;
              urlString = dbObject[urlString];

            } else {
              urlString = dbObject[urlString]
            }
            //overall, story, and performance stars
            let overallStars = Math.floor(Math.random() * 5) + 1;

            function randomIntFromInterval(min, max) {
              return Math.floor(Math.random() * (max - min + 1) + min);
            }

            let storyStars = randomIntFromInterval((overallStars - 2) , (overallStars + 2));
            let performanceStars = randomIntFromInterval((overallStars - 1), (overallStars + 2));

            if (storyStars < 1) {
              storyStars = 1;
            }
            if (storyStars > 5) {
              storyStars = 5;
            }

            if (performanceStars < 1) {
              performanceStars = 1;
            }
            if (performanceStars > 5) {
              performanceStars = 5;
            }

            //date
            let date = randomDate(new Date(2015, 0, 1), new Date());

            //found helpful
            let foundHelpful = Math.floor(Math.random() * 100);
            //source
            let source;
            if(foundHelpful % 10 === 0) {
              source = 'Amazon'

            } else {
              source = 'Audible'
            }
            //location
            let location;
            if (foundHelpful % 5 === 0) {
              location = 'Canada'
            } else {
              location = 'United States'
            }
            //review
            let review;
            let numberOfParagraphs = Math.floor(Math.random() * 3) + 1;
            let numberOfSentences = Math.floor(Math.random() * 7) + 1;
            let conditional = Math.random() * 5;
            if (conditional < 4) {
              review = lorem.generateParagraphs(numberOfParagraphs);
            } else {
              review = lorem.generateParagraphs(numberOfSentences)
            }
            //review title
            let reviewTitle;
            let numberOfWords = Math.floor(Math.random() * 6);
            reviewTitle = lorem.generateWords(numberOfWords);

            const newReview = new Review({
              reviewerName: reviewerName,
              reviewerId: reviewerId,
              review: review,
              urlString: urlString,
              bookId: bookId,
              date: date,
              overallStars: overallStars,
              performanceStars: performanceStars,
              storyStars: storyStars,
              reviewTitle: reviewTitle,
              foundHelpful: foundHelpful,
              source: source,
              location: location
            })
            await newReview.save();
          }
        }
        console.log('seeded ' + end + ' books')
        start = end + 1;
        end = end + increment;
        reviewCreator(start, end)
      } else {
        let t1 = performance.now()
        console.log('seeding complete for a total of ' + start + 'books')
        console.log("Call to seed database took " + ((t1 - t0) / 1000) + " seconds.")
        return;
      }
    }
    reviewCreator(start, end)
  })
  .catch((err) => {
    console.log(err);
  })
}

//seedDatabase();


