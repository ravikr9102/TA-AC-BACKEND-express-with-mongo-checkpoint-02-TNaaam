var express = require('express');
var router = express.Router();

var event = require('../models/event');
var remark = require('../models/remark');

// edit comment
router.get('/:remarkId/edit', (req, res, next) => {
  var remarkId = req.params.remarkId;
  remark.findById(remarkId, (err, remark) => {
    if (err) return next(err);
    res.render('editremarks', { remark });
  });
});

// comment update
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  remark.findByIdAndUpdate(id, req.body, (err, remark) => {
    if (err) return next(err);
    res.redirect('/event/' + remark.eventId);
  });
});

// delete comment
router.get('/:id/delete',(req,res,next) => {
    var id = req.params.id;
    remark.findByIdAndDelete(id,(err,remark) => {
        if(err) return next(err);
        event.findByIdAndUpdate(remark.articleId ,{$pull: {remark: remark.id}},(err,event) => {
            if(err) return next(err);
            res.redirect('/event/' + remark.eventId)
        });
    });
});

// increment like for comment
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  remark.findByIdAndUpdate(id, { $inc: { likes: 1 }}, (err, remark) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  });
});

module.exports = router;
