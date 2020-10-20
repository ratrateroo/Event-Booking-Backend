const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require('../../models/bookings');
const bookings = require("../../models/bookings");

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

const events = async eventIds => {

  try {
    const events = await Event.find({ _id: { $in: eventIds }});
  events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  } catch (err){
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

const user = async userId => {
  try {
    const user = await User.findById(userId)
    
      return { 
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
       };
  } catch (err) {
    throw err;
  }
  
    
    
}

module.exports = {

      //! Converted to async await
      // events: () => {
      //   return Event.find()
      //     .then((events) => {
      //       return events.map((event) => {
      //         return { 
                
      //           ...event._doc,
      //           _id: event._doc._id.toString(),
      //           date: new Date(event._doc.date).toISOString(),
      //           creator: user.bind(this, event._doc.creator) };
      //       });
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       throw err;
      //     });
      // },

      events: async () => {
        try {
          const events = await Event.find();
          return events.map((event) => {
              return { 
                
                ...event._doc,
                _id: event._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator) 
              };
            });
        } catch (err) {
          console.log(err);
            throw err;
        }
        
          
      },
      
      //! Converted to async await
      // createEvent: (args) => {
      //   const event = new Event({
      //     title: args.eventInput.title,
      //     description: args.eventInput.description,
      //     price: +args.eventInput.price,
      //     date: new Date(args.eventInput.date),
      //     creator: '5f8c29ebabb1422024cc8db1'

      //   });
      //   let createdEvent;
      //   return event
      //     .save()
      //     .then((result) => {
      //       createdEvent = {
      //         ...result._doc,
      //         _id: result._doc._id.toString(),
      //         creator: user.bind(this, result._doc.creator)
      //       };
      //       return User.findById('5f8c29ebabb1422024cc8db1');
            
      //     })
      //     .then(user => {
      //       if (!user) {
      //         throw new Error('User not found.');
      //       }
      //       user.createdEvents.push(event);
      //       return user.save();
      //     })
      //     .then(result => {
      //       return createdEvent;
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       throw err;
      //     });

      // },

      bookings: async () => {
        try {
          const bookings = await Booking.find()
          return {
            ...bookings._doc,
            _id: bookings.id,
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()

          }
        }catch (err) { 
          throw err;
        }
      },

      createEvent: async args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5f8c29ebabb1422024cc8db1'
        });

        let createdEvent;

        try 
        {        
        const result = await event
        .save()
            createdEvent = {
              ...result._doc,
              _id: result._doc._id.toString(),
              date: new Date(event._doc.date).toISOString(),
              creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById('5f8c29ebabb1422024cc8db1');
           
            if (!creator) {
              throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();
        
            return createdEvent;
          } catch (err) {
            console.log(err);
            throw err;
          };

      },

      //! Converted to async await
      // createUser: (args) => {
      //   return User.findOne({ email: args.userInput.email})
      //     .then(user => {
      //       if (user) {
      //         throw new Error('User exists already.');
      //       }
      //       return bcrypt.hash(args.userInput.password, 12);
      //     })        
      //     .then((hashedPassword) => {
      //       const user = new User({
      //         email: args.userInput.email,
      //         password: hashedPassword,
      //       });
      //       return user.save();
      //     })
      //     .then((result) => {
      //       return { ...result._doc, password: null, _id: result.id };
      //     })
      //     .catch((err) => {
      //       throw err;
      //     });
      // },

      createUser: async args => {
        try {

        const existingUser = await User.findOne({ email: args.userInput.email})
          
            if (existingUser) {
              throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                 
          
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            const result = await user.save();
        
           
            return { ...result._doc, password: null, _id: result.id };
           
        } catch (err) {

          throw err;
        }
          
          
      },

      bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
          user: '5f8c29ebabb1422024cc8db1',
          event: fetchedEvent
        });
        const result = await booking.save();
        return {
          ...result._doc,
          _id: result.id,
          createdAt: new Date(result._doc.createdAt.toISOString()),
          updatedAt: new Date(result._doc.updatedAt.toISOString()),
        };
        
      }
    }