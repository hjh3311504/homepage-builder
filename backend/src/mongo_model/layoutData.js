const mongoose = require('mongoose');
const layoutDataSchema = new mongoose.Schema(
  { layoutData: JSON },
  { minimize: false }
);

module.exports = mongoose.model('layoutdatas', layoutDataSchema);
