const { Pool, Client } = require('pg')

const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'audible',
  password: '',
  port: 5432,
})

client.connect()

// create users table
const createUsersTableText = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS users (
  userId SERIAL NOT NULL PRIMARY KEY,
  username VARCHAR(255),
  url VARCHAR(255)
);
`
client.query(createUsersTableText)
.then(() => {
  console.log('user table created')

})
.catch((err) => {
  console.log('error', err)
})

// create books table
const createBooksTableText = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS books (
  bookId SERIAL NOT NULL PRIMARY KEY,
  title VARCHAR(255)
);
`
client.query(createBooksTableText)
.then(() => {
  console.log('books table created')

})
.catch((err) => {
  console.log('error', err)
})

// create reviews table
const createReviewsTableText = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS reviews (
  reviewId SERIAL NOT NULL PRIMARY KEY,
  userId VARCHAR(255),
  bookId VARCHAR(255),
  review VARCHAR(255),
  date VARCHAR(255),
  overallStars SMALLINT,
  performanceStars SMALLINT,
  storyStars SMALLINT,
  reviewTitle VARCHAR(255),
  foundHelpful SMALLINT,
  source VARCHAR(255),
  location VARCHAR(255)
);
`
client.query(createReviewsTableText)
.then(() => {
  console.log('reviews table created')

})
.catch((err) => {
  console.log('error', err)
})