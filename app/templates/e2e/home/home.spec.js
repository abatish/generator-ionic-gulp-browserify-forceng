'use strict';

describe('The home view', function () {
  var page,
      shared,
      vm;

  beforeEach(function() {
    browser.get('/index.html');
    page = require('./home.po');
    shared = require('../shared.po');
  });

  it('should run this test', function () {
    expect(page.loginButton.isDisplayed()).toBeTruthy();
  });

});
