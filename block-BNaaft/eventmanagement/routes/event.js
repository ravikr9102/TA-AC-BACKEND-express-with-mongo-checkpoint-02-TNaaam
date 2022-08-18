var express = require('express');
var router = express.Router();

var event = require('../models/event');
var remark = require('../models/remark');
var moment = require('moment');
const { query } = require('express');

// middleware
const allData = (req, res, next) => {
  event.find({}, (err, events) => {
    if (err) return next(err);
    res.locals.categories = [
      ...new Set(events.map((event) => event.category).flat()),
    ];
    let locations = events.map((event) => event.location);
    res.locals.location = [...new Set(locations)];
    next();
  });
};

// list event
router.get('/', allData, async (req, res, next) => {
  let { categories, location, startDate, endDate } = req.query;
  const filter = {};
  // query for categories filter
  if (categories) {
    filter.category = { $in: categories };
  }
  //query for location filter
  if (location) {
    filter.location = location;
  }
  //if we are passsing date then get date data
  if (startDate && endDate) {
    filter.startDate = { $gte: startDate, $lte: endDate };
  }
  try {
    let events = await event.find(filter);
    console.log(events);
    return res.render('allEvent', { events: events });
  } catch (error) {
    next(error);
  }
});

// create event form
router.get('/new', (req, res) => {
  res.render('eventForm');
});

// fetch single event
router.get('/:id', allData, async (req, res, next) => {
  try {
    var id = req.params.id;
    let singleEvent = await event.findById(id).populate('remark');
    return res.render('eventDetail', { event: singleEvent });
  } catch (error) {
    next(error);
  }
});

// create event
router.post('/', (req, res, next) => {
  req.body.category = req.body.category.split(' ');
  event.create(req.body, (err, createdEvent) => {
    if (err) return next(err);
    console.log('created event', createdEvent);
    res.redirect('/');
  });
});

// edit event form
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  event.findById(id, (err, event) => {
    console.log(err, event);
    var startDate = moment(event.startDate).format().slice(0, 10);
    var endDate = moment(event.endDate).format().slice(0, 10);
    if (err) return next(err);
    res.render('editEvent', { event, startDate, endDate });
  });
});

// update event
router.post('/:id', (req, res, next) => {
  console.log(req.body);
  var id = req.params.id;
  event.findByIdAndUpdate(id, req.body, (err, updateData) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  });
});

// delete event
router.get('/:id/delete', allData, (req, res, next) => {
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
router.get('/:id/likes', allData, (req, res, next) => {
  var id = req.params.id;
  event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  });
});

// decrement like
router.get('/:id/Dislikes', allData, (req, res, next) => {
  var id = req.params.id;
  event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/event/' + id);
  });
});

// for remark
router.post('/:eventId/remark', allData, (req, res, next) => {
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
