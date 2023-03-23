const router = require('express').Router();

const login = require('./login');
const auth = require('./auth');
const cdn = require('./cdn');
const layout = require('./layout');

router.use('/login', login);
router.use('/auth', auth);
router.use('/cdn', cdn);
router.use('/layout', layout);
router.use('/', (req, res) => {
  res.send('hello');
});

module.exports = router;
