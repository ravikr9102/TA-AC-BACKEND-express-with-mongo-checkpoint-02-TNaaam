var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    eventId:{ type: Schema.Types.ObjectId,ref: "Event"},
});

module.exports = mongoose.model('Category',categorySchema);