const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require('./merge');





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
          return transformEvent(event);
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

    

    createEvent: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized!');
      }

      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId
      });

      let createdEvent;

      try 
      {        
      const result = await event
      .save()
          createdEvent = transformEvent(result);;
          const creator = await User.findById(req.userId);
         
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

    

    

    

    
  }