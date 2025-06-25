export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testMatch: ["**/src/tests/**/*.test.js"],
};