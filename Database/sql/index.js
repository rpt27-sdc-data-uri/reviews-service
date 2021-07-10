const { Pool, Client } = require('pg')
const Faker = require ('faker');
var Promise = require("bluebird");
const randomDate = require('../databaseHelpers/seedDBHelperFunctions').randomDate;
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

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
const pgp = require('pg-promise')({
  capSQL: true // generate capitalized SQL
});

const connectionObject = {
  user: 'marceloyates',
  host: 'localhost',
  database: 'audible',
  password: '',
  port: 5432,
}
const db = pgp(connectionObject); // your database object

//populate books
const csBooks = new pgp.helpers.ColumnSet([
  'title'
], {table: 'books'});

function getNextBooks(t, pageIndex) {
  let data = null;
  if (pageIndex < 1000) {
      data = [];
      for (let i = 0; i < 10000; i++) {
          data.push({
            title: lorem.generateWords(Math.floor(Math.random() * 6))
          });
      }
  }
  return Promise.resolve(data);
}

function bookSeeder() {
  console.log('book seeding beginning...')

  db.tx('massive-insert', t => {
    const processData = data => {
        if (data) {
            const insert = pgp.helpers.insert(data, csBooks);
            return t.none(insert);
        }
    };
    return t.sequence(index => getNextBooks(t, index).then(processData));
  })
    .then(data => {
        // COMMIT has been executed
        console.log('Total book batches:', data.total, ', Duration:', data.duration);
    })
    .catch(error => {
        // ROLLBACK has been executed
        console.log(error);
    });
}


//populate users
const csUsers = new pgp.helpers.ColumnSet([
  'username',
  'url'
], {table: 'users'});

function getNextUsers(t, pageIndex) {
  let data = null;
  if (pageIndex < 1000) {
    console.log('user page ', pageIndex)

      data = [];
      for (let i = 0; i < 10000; i++) {
          data.push({
            username: lorem.generateWords(Math.floor(Math.random() * 6)),
            url: 'https://picsum.photos/seed/' + Faker.datatype.number(10000000) + 'picsum/3000/2000'
          });
      }
  }
  return Promise.resolve(data);
}

function userSeeder() {
  console.log('user seeding beginning...')
  db.tx('massive-insert', t => {
    const processData = data => {
        if (data) {
            const insert = pgp.helpers.insert(data, csUsers);
            return t.none(insert);
        }
    };
    return t.sequence(index => getNextUsers(t, index).then(processData));
  })
    .then(data => {
        // COMMIT has been executed
        console.log('Total user batches:', data.total, ', Duration:', data.duration);
    })
    .catch(error => {
        // ROLLBACK has been executed
        console.log(error);
    });
}

//populate reviews
const csReviews = new pgp.helpers.ColumnSet([
  'review',
  'date',
  'overall_stars',
  'performance_stars',
  'story_stars',
  'review_title',
  'found_helpful',
  'source',
  'location'
], {table: 'reviews'});

function getNextReviews(t, pageIndex) {

  let data = null;
  if (pageIndex < 1000) {
    console.log('page ', pageIndex)
      data = [];
      for (let i = 0; i < 10000; i++) {
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

          data.push({
            review: review,
            date: date,
            overall_stars: overallStars,
            performance_stars: performanceStars,
            story_stars: storyStars,
            review_title: reviewTitle,
            found_helpful: foundHelpful,
            source: source,
            location: location
          });
      }
  }
  return Promise.resolve(data);
}

function reviewSeeder() {
  console.log('reviews seeding beginning...')

  db.tx('massive-insert', t => {
    const processData = data => {
        if (data) {
            const insert = pgp.helpers.insert(data, csReviews);
            return t.none(insert);
        }
    };
    return t.sequence(index => getNextReviews(t, index).then(processData));
  })
    .then(data => {
        // COMMIT has been executed
        console.log('Total reviews batches:', data.total, ', Duration:', data.duration);
    })
    .catch(error => {
        // ROLLBACK has been executed
        console.log(error);
    });
}

//seed database - uncomment and run to seed
// bookSeeder();
// userSeeder();
// reviewSeeder();





