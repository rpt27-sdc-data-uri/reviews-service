const { Pool, Client } = require('pg')
//require('dotenv').config()

// const client = new Client({
//   user: 'root',
//   host: 'localhost',
//   database: 'audible',
//   password: '',
//   port: 5432,
// })

const client = new Client({
  user: 'postgres',
  host: '3.136.156.146',
  database: 'audible',
  password: 'password',
  port: 5432,
})

client.connect()
//CREATE EXTENSION IF NOT EXISTS "pgcrypto";


/// create users table
const createUsersTableText = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL NOT NULL,
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
  book_id SERIAL NOT NULL,
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
  review_id SERIAL NOT NULL,
  user_id INT,
  book_id INT,
  review TEXT,
  date VARCHAR(255),
  overall_stars SMALLINT,
  performance_stars SMALLINT,
  story_stars SMALLINT,
  review_title VARCHAR(255),
  found_helpful SMALLINT,
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

//
//   FOREIGN KEY (user_id) REFERENCES users(user_id),
//   FOREIGN KEY (book_id) REFERENCES books(book_id)