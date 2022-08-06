var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    title: { type: String, required: true },
    summary: String,
    host: String,
    startDate: { type: Date},
    endDate: { type: Date},
    category: [ String ],
    location: String,
    likes: { type: Number, default: 0},
    remark: [{ type: Schema.Types.ObjectId, ref: 'Remark'}]
},{timestamps: true});

module.exports = mongoose.model('Event',eventSchema);