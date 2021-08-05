const { Pool, Client } = require('pg')
const Faker = require ('faker');
var Promise = require("bluebird");
const randomDate = require('../mongoose/databaseHelpers/seedDBHelperFunctions').randomDate;
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
const pgp = require('pg-promise')({
  capSQL: true // generate capitalized SQL
});

const connectionObject = {
  user: 'root',
  host: 'localhost',
  database: 'audible',
  password: '',
  port: 5432,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0
}
const db = pgp(connectionObject); // your database object

//populate 10M books
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


//populate 10,000 users
const csUsers = new pgp.helpers.ColumnSet([
  'username',
  'url'
], {table: 'users'});

function getNextUsers(t, pageIndex) {
  let data = null;
  if (pageIndex < 1) {
    console.log('user page ', pageIndex)

      data = [];
      for (let i = 0; i < 10000; i++) {
          data.push({
            username: Faker.name.findName(),
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

//populate 50M reviews
const csReviews = new pgp.helpers.ColumnSet([
  'user_id',
  'book_id',
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

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNextReviews(t, pageIndex) {

  let data = null;
  if (pageIndex < 2000) {
    console.log('page ', pageIndex)
      data = [];
      for (let i = 0; i < 10000; i++) {
        //user_id
        let user_id = randomIntFromInterval(1, 10000);

        //book_id
        let book_id = randomIntFromInterval(1, 10000000);

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

          data.push({
            user_id: user_id,
            book_id: book_id,
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
//bookSeeder();
//userSeeder();
//reviewSeeder();

//Indexing function
async function indexing() {
  console.log('indexing...')
  // await db.query('CREATE INDEX idx_book_id ON reviews (book_id)');
  await db.query('CREATE INDEX idx_review_id ON reviews (review_id)');
  console.log('indexed')
}

//indexing();

//Get Document Postgres
async function getDocumentSQL(key) {

  try {
    var t0 = performance.now()

    return await db.query('SELECT * FROM reviews WHERE book_id=$1', [key]);
  } finally {
    var t1 = performance.now();
    let executionTime = t1 - t0;
    console.log('Time in milliseconds searching last 10% of database:', executionTime)
  }
}

//Insert review Postgres
async function insertDocumentSQL(review) {

  try {
    //console.log("bookId SQL insert", review[0])
    var t0 = performance.now()
    // let query = "INSERT INTO reviews (review, date, overall_stars, performance_stars, story_stars, review_title, found_helpful, source,location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);"
    let query = "INSERT INTO reviews (date, found_helpful, location, overall_stars, performance_stars, review, review_title, source, story_stars) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);"

//    await db.query(query, [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]]);
    await db.query(query, review);

  } finally {
    var t1 = performance.now();
    let executionTime = t1 - t0;
    console.log('Time in milliseconds searching last 10% of database:', executionTime)
  }
}

//Update Document Postgres
async function updateDocumentSQL(review) {

  try {
    console.log("bookId SQL", review)
    var t0 = performance.now()
    let query = "UPDATE reviews SET review, date, overall_stars, performance_stars, story_stars, review_title, found_helpful, source,location WHERE review_id = $1;"

    await db.query(query, review);

  } finally {
    var t1 = performance.now();
    let executionTime = t1 - t0;
    console.log('Time in milliseconds searching last 10% of database:', executionTime)
  }
}

//Delete review Postgres
async function deleteDocumentSQL(id) {

  try {
    console.log("review_id SQL", id)
    var t0 = performance.now()
    let query = "DELETE FROM reviews WHERE review_id = $1;"

    await db.query(query, [id]);

  } finally {
    var t1 = performance.now();
    let executionTime = t1 - t0;
    console.log('Time in milliseconds searching last 10% of database:', executionTime)
  }
}

module.exports = {
  getDocumentSQL: getDocumentSQL,
  insertDocumentSQL: insertDocumentSQL,
  updateDocumentSQL: updateDocumentSQL,
  deleteDocumentSQL: deleteDocumentSQL
}





