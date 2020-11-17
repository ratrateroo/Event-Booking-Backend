const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});
//! Converted to async await
// const events = eventIds => {
//   return Event.find({ _id: { $in: eventIds }})
//   .then(events => {
//     return events.map(event => {
//       return {
//         ...event._doc,
//         _id: event.id,
//         date: new Date(event._doc.date).toISOString(),
//         creator: user.bind(this, event.creator)
//       };
//     });
//   })
//   .catch(err => {
//     throw err;
//   });
// }

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventId.indexOf(a._id.toString()) - eventId.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};
//? changed to use eventLoader
// const singleEvent = async (eventId) => {
//   try {
//     const event = await Event.findById(eventId);
//     return transformEvent(event);
//   } catch (err) {
//     throw err;
//   }
// };

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

//! Converted to async await
// const user = userId => {
//   return User.findById(userId)
//     .then(user => {
//       return {
//         ...user._doc,
//         _id: user.id,
//         createdEvents: events.bind(this, user._doc.createdEvents)
//        };
//     })
//     .catch(err => {
//       throw err;
//     })
// }

//? changed using eventLoader
//? changed using userLoader
// const user = async (userId) => {
//   try {
//     const user = await User.findById(userId);

//     return {
//       ...user._doc,
//       _id: user.id,
//       createdEvents: events.bind(this, user._doc.createdEvents),
//     };
//   } catch (err) {
//     throw err;
//   }
// };

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());

    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

//   exports.user = user;
//   exports.events = events;
//   exports.singleEvent = singleEvent;
