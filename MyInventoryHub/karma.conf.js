module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--remote-debugging-port=9222',
          '--headless'
        ]
      }
    },
    singleRun: true
  });
};
