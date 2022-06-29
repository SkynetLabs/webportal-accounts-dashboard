module.exports = {
  projectId: "499db8",

  videoUploadOnPasses: false,

  e2e: {
    specPattern: "cypress/e2e/**/*.test.js",
    baseUrl: "http://localhost:8000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
