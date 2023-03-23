const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleStrategyOptions } = require('./serverOptions');
const memberModel = require('../model/member');

exports.GoogleStrategy = new GoogleStrategy(
  googleStrategyOptions,
  async (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
);
