const layoutData = require('../mongo_model/layoutData');

const router = require('express').Router();

router.get('/', (req, res) => {
  // 이전 레이아웃 데이터 가져오기
  layoutData
    .findOne({})
    .sort({ _id: -1 })
    .exec((err, prevData) => {
      if (err) {
        res.json({ dataLoadingResult: false });
        return console.error('mongoDB find error');
      }
      if (!prevData || !prevData.layoutData)
        res.json({ dataLoadingResult: false });
      else
        res.json({ dataLoadingResult: true, layoutData: prevData.layoutData });
    });
});

router.post('/', (req, res) => {
  // console.log(req.body);
  const modifiedLayout = new layoutData({ layoutData: req.body.layoutData });
  modifiedLayout.save((err) => {
    if (err) return console.error('mongoDB save error');
  });
  res.end();
});

router.post('/redo', (req, res) => {
  /* layoutData
    .findOne({})
    .sort({ _id: -1 })
    .skip(1)
    .exec((err, prevData) => {
      if (err) {
        res.json({ dataLoadingResult: false });
        return console.error('mongoDB find error');
      }
      if (!prevData || !prevData.layoutData)
        res.json({ dataLoadingResult: false });
      else {
        // console.log(typeof prevData._id);
        res.json({
          dataLoadingResult: true,
          layoutData: prevData.layoutData,
          layoutDataId: prevData._id,
        });
      }
    }); */
});

module.exports = router;
