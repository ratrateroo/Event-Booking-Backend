const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

const events = [];

app.use(bodyParser.json());

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
        }


        type User {
          _id: ID!
          email: String!
          password: String!
        }

        input EventInput {
          title: String!
          description: String
          price: Float!
          date: String!
        }

        input UserInput }
        email: String!
        password: String!


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
              return { ...event._doc, _id: event._doc._id.toString() };
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

        return event;
      },

      createUser: (args) => {
        const user = new User({
          email: args.userInput.email,
          password: args.userInput.password,
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
