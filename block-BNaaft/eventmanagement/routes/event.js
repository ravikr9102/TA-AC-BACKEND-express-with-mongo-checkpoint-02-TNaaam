var express = require('express');
var router = express.Router();

var event = require('../models/event');
var remark = require('../models/remark');
var category = require('../models/category');

// list event
router.get('/', (req, res, next) => {
  event.find({}, (err, event) => {
    if (err) return next(err);
    res.render('allEvent', { event: event });
  });
});

// create event form
router.get('/new', (req, res) => {
  res.render('eventForm');
});

// router.get('/:id', (req, res, next) => {
//   var id = req.params.id;
//   event.findById(id, (err, event) => {
//     console.log(event);
//     if (err) return next(err);
//     res.render('eventDetail', { event });
//   });
// });

// fetch single event
router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  event
    .findById(id)
    .populate('remark')
    .exec((err, event) => {
      if (err) return next(err);
      res.render('eventDetail', { event });
    });
});

// create event
router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags;
  event.create(req.body, (err, createdEvent) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// edit event form
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  event.findById(id, (err, event) => {
    if (err) return next(err);
    res.render('editEvent', { event });
  });
});

// update event
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  event.findByIdAndUpdate(id, req.body, (err, updateData) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  });
});

// delete event
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  event.findByIdAndDelete(id, (err, event) => {
    if (err) return next(err);
    remark.remove({ eventId: event.id }, (err) => {
      if (err) return next(err);
      res.redirect('/event');
    });
  });
});

// increment like
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  });
});

// decrement like
router.get('/:id/Dislikes', (req, res, next) => {
  var id = req.params.id;
  event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  });
});

// for remark
router.post('/:eventId/remark', (req, res, next) => {
  var eventId = req.params.eventId;
  req.body.eventId = eventId;
  remark.create(req.body, (err, remark) => {
    if (err) return next(err);
    event.findByIdAndUpdate(
      eventId,
      { $push: { remark: remark._id } },
      (err, event) => {
        if (err) next(err);
        res.redirect('/event/' + eventId);
      }
    );
  });
});

module.exports = router;
