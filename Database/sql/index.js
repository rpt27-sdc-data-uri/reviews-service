const { Pool, Client } = require('pg')
const Faker = require ('faker');
var Promise = require("bluebird");
const randomDate = require('../databaseHelpers/seedDBHelperFunctions').randomDate;
const imageGetterFunction  = require('../../S3_Access/imagesObject.js').imageGetter;
const randomImage = require('../databaseHelpers/seedDBHelperFunctions').randomImage;
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
var fs = require('fs');
const {performance} = require('perf_hooks');
const csvWriter = require('csv-write-stream')
const writer = csvWriter()

const client = new Client({
  user: 'marceloyates',
  host: 'localhost',
  database: 'audible',
  password: '',
  port: 5432,
})

client.connect()


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

//populate users table
// const csvUsersGenerator = async () =>{
//   return new Promise(function (resolve, reject) {
//     imageGetterFunction(resolve);
//   })
//   .then(async (data) => {
//     console.log('data', data)
//     let start = 0
//     let end = 10
//     let add = 10
//     //let count = 1;

//     let recurse = async (start, end) => {
//       if (end <= 10) {
//         writer.pipe(fs.createWriteStream('users.csv'))
//         let imageObj = data;
//         const dbObject = {};
//         for (let i = start; i < end; i++) {
//           console.log('created user ' + i)
//           let imageUrl = await randomImage(imageObj);
//           let username

//           //username
//           let usernameGen = async () => {
//             let name = Faker.name.findName();
//             if (dbObject[i] === undefined) {
//               dbObject[i] = name;
//               username = name;
//             } else {
//               username = dbObject[i]
//             }
//           }
//           await usernameGen();
//           //url string
//           let urlString = 'imageUrl' + i.toString();
//           let urlGen = async () => {
//             if (dbObject[urlString] === undefined) {
//               dbObject[urlString] = imageUrl;
//               urlString = dbObject[urlString];
//             } else {
//               urlString = dbObject[urlString]
//             }
//           }
//           await urlGen();

//           await writer.write({
//             userid: i,
//             username: username,
//             urlString: urlString
//           });
//         }
//         await writer.end();
//         start = end + 1;
//         end = end + add;
//         await recurse(start, end)
//       }
//     }
//     await recurse(start, end)
//     console.log("users csv complete");
//   })
// }

// csvUsersGenerator()
  // .then( async () => {
  //   console.log('importing into postgres')

  //   await client.query(
  //     "COPY users (userid, username, url) FROM '/Users/marceloyates/Documents/Hack_Reactor/Hack_Reactor_RPT27/SDC/reviews-service/users.csv' DELIMITER ',' CSV HEADER;"
  //   );

  //   console.log('importing complete')
  // })
  // .catch((err) => {
  //   console.log('error', err)
  // })

//populate books table
const csvBooksGenerator = async () =>{
  let start = 0
  let end = 1
  let add = 1

  let recurse = async (start, end) => {

    if (end <= 10) {
      await writer.pipe(fs.createWriteStream('books.csv'));
      for (var i = start; i < end; i++) {
        await writer.write({
          book_id: i,
          book_title: lorem.generateWords(Math.floor(Math.random() * 6))
        });
      }

      await writer.end();
      if (true) {
        await client.query(
          "COPY books (bookid, title) FROM '/Users/marceloyates/Documents/Hack_Reactor/Hack_Reactor_RPT27/SDC/reviews-service/books.csv' DELIMITER ',' CSV HEADER;"
          );
        console.log('copied')
      }
      start = end + 1;
      end = end + add;
      await recurse(start, end)
    } else {
      return;
    }
  }
  await recurse(start, end)
  console.log("book csv complete");
  process.exit();
}

csvBooksGenerator();

  // .then( async () => {
  //   console.log('importing into postgres')

  //   await client.query(
  //     "COPY books (bookid, title) FROM '/Users/marceloyates/Documents/Hack_Reactor/Hack_Reactor_RPT27/SDC/reviews-service/books.csv' DELIMITER ',' CSV HEADER;"
  //   );

  //   console.log('importing complete')
  // })
  // .catch((err) => {
  //   console.log('error', err)
  // })

// populate reviews table
// const csvReviewsGenerator = async () =>{
//   let start = 0
//   let end = 1000000
//   let add = 1000000
//   //let count = 1;

//   let recurse = async (start, end) => {
//     if (end <= 1000000) {
//       writer.pipe(fs.createWriteStream('reviews.csv'));
//       for (var i = start; i < end; i++) {
//         console.log('review ' + i);

//         await writer.write({
//           reviewid: ,
//           userid: ,
//           bookid: ,
//           review: ,
//           date: ,
//           verallstars: ,
//           performancestars: ,
//           storystars: ,
//           reviewtitle: ,
//           foundhelpful: ,
//           source: ,
//           location:

//         });
//       }

//       await writer.end();
//       start = end + 1;
//       end = end + add;
//       //count++;
//       recurse(start, end)
//     }
//   }
//   await recurse(start, end)

//   console.log("users csv complete");
// }

// csvReviewsGenerator()
//   .then( async () => {
//     console.log('importing into postgres')

//     await client.query(
//       "COPY books (bookid, title) FROM '/Users/marceloyates/Documents/Hack_Reactor/Hack_Reactor_RPT27/SDC/reviews-service/books.csv' DELIMITER ',' CSV HEADER;"
//     );

//     console.log('importing complete')
//   })
//   .then((err) => {
//     console.log('error', err)
//   })



// function csvUsersGenerator() {
//   return new Promise(function (resolve, reject) {
//     imageGetterFunction(resolve);
//   })
//   .then(async (data) => {
//     writer.pipe(fs.createWriteStream('reviews.csv'))
//     let imageObj = data;
//     const dbObject = {};
//     let t0 = performance.now()


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

//         await writer.write({reviewerName, reviewerId, review , urlString , bookId , date , overallStars , performanceStars, storyStars , reviewTitle , foundHelpful , source , location});
//       }
//       console.log('seeded book id ' + i)
//     }
//     writer.end()
//   })
//   .then(() => {
//     let t1 = performance.now()
//     console.log('seeding complete')
//   })
//   .catch((err) => {
//     console.log(err);
//   })
// }
