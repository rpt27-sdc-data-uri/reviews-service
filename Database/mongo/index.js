const { MongoClient } = require("mongodb");
const Faker = require ('faker');
const randomDate = require('../databaseHelpers/seedDBHelperFunctions').randomDate;
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

// Connection URI
const uri = 'mongodb://localhost:27017/'

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function reviewGenerator(id) {
  let reviews = [];
  const reviewCount = Math.floor(10 * Math.random());
  for (let i = 0; i < reviewCount; i++) {
    //book id
    let bookId = id;
    //review id
    let reviewerId = Math.floor(100 * Math.random());
    //reviewer name
    let reviewerName = lorem.generateWords(Math.floor(Math.random() * 2));
    //url string
    let urlString = 'https://picsum.photos/seed/' + reviewerId + 'picsum/3000/2000';
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
    let numberOfParagraphs = Math.floor(Math.random() * 2) + 1;
    let numberOfSentences = Math.floor(Math.random() * 4) + 1;
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

    let reviewObj = {
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
    }
    reviews.push(reviewObj)
  }
  return reviews;
}

client.connect(async function(err, mongoclient) {
  let t0 = performance.now();
  console.log('start seeding')
  var db = mongoclient.db("mongo_sdc");

  for(let i = 0; i < 10000000; i++) {
    let reviews = await reviewGenerator(i);

    if (reviews.length > 0) {
      await db.collection('reviews').insertMany(reviews)
    }
  }
  let t1 = performance.now();
  console.log('End: time elapsed ', (t1 - t0))

  // Close the connection
  mongoclient.close();
});



