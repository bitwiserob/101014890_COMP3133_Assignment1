const mongoose = require("mongoose");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");

const uri =
  "mongodb+srv://admin:1234@101014890.ceawi2z.mongodb.net/comp3133_assigment1?retryWrites=true&w=majority";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const server = new ApolloServer({ typeDefs, resolvers });
async function startServer() {
  await server.start();
  const app = express();
  server.applyMiddleware({ app });
  const port = process.env.PORT || 4000;
  

  app.listen({ port: port }, () =>
    console.log(
      `Server is running on http://localhost:4000${server.graphqlPath}`
    )
  );
}
startServer();
