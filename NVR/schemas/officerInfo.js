var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/RallyComputer');


var schema = mongoose.Schema({
    badgeNumber: String,
    Name: String,
    CarNumber: Number,
    
})

schema.set('toJSON', {
    virtuals: true
});
var officerInfo = mongoose.model('officerInfo', schema, 'officerInformation');


module.exports = officerInfo;