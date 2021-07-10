const Review = require ('../database.js');
const Faker = require ('faker');
const randomDate = require('./seedDBHelperFunctions').randomDate;
const imageGetterFunction  = require('../../S3_Access/imagesObject.js').imageGetter;
const randomImage = require('./seedDBHelperFunctions').randomImage;
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const {performance} = require('perf_hooks');

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

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
          for (let j = 0; j < reviewCount; j++) {
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