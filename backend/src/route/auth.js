const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('get auth');
});

module.exports = router;
