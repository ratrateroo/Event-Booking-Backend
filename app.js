const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();


app.use(bodyParser.json());

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds }})
  .then(events => {
    return events.map(event => {
      return {...event._doc, _id: event.id};
    })
  })
  .catch(err => {
    throw err;
  });
}

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return { ...user._doc, _id: user.id,
      creator: user.bind(this, event.creator) };
    })
    .catch(err => {
      throw err;
    })
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
          creator: User!
        }


        type User {
          _id: ID!
          email: String!
          password: String
          createdEvents: [Event!]
        }

        input EventInput {
          title: String!
          description: String
          price: Float!
          date: String!
        }

        input UserInput {
        email: String!
        password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { 
                ...event._doc,
                _id: event._doc._id.toString(),
                creator: user.bind(this, event._doc.creator) };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });

      },

      createUser: (args) => {
        return bcrypt
          .hash(args.userInput.password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, _id: result.id };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

const url = `mongodb://127.0.0.1:27017/${process.env.MONGO_DB}`;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the Database.");
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
