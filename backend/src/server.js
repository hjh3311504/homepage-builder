const express = require('express');
const app = express();

app.set('trust proxy', true);

// cors 설정
const cors = require('cors');
const { corsOptions } = require('./api/serverOptions');
app.use(cors(corsOptions));

// passport 설정
/** !! 패스포트 만들기 220125 */
const passport = require('passport');
const { GoogleStrategy } = require('./api/strategy');
// passport.use(LocalStrategy);
// passport.use(JwtStrategy);
passport.use(GoogleStrategy);
app.use(passport.initialize());

passport.serializeUser((member, done) => {
  done(null, member.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

// mongo DB 설정
const mongoose = require('mongoose');
const { mongoUrl } = require('./api/serverOptions');
mongoose.connect(mongoUrl);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to mongoDB server');
});

// 임시 static 폴더.
// cdn 서버 생성 시
app.use(express.static('cdn'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require('./route/router');
app.use('/', router);

// 윈도우 개발용
const https = require('https');
const fs = require('fs');
const PORT = 5100;
const httpsOptions = {
  key: fs.readFileSync('openssl/key.pem'),
  cert: fs.readFileSync('openssl/cert.pem'),
  passphrase: '20ft',
};

if (process.env.NODE_ENV === 'development') {
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`The Https Express server is listening at port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`The Express server is listening at port ${PORT}`);
  });
}
