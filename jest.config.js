// module.exports.config = {
//   moduleNameMapper: {
//     '\\.(css|less)$': __dirname + '/Client/Tests/styleMock.js',
//   },
//   "preset": "@shelf/jest-mongodb",
// };

const config = {
  verbose: true,
  moduleNameMapper: {
        '\\.(css|less)$': __dirname + '/Client/Tests/styleMock.js',
  },
  preset: "@shelf/jest-mongodb",
  setupFilesAfterEnv: ["/Users/jametevia/rpt/reviews/Client/Tests/setupTests.js"]
};

module.exports = config;