const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const http = require("http");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// I don't need routes for graphql
// const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// });

let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();
const httpserver = http.createServer(app);

// integrate our Apollo server with the Express application as middleware
// apolloServer.applyMiddleware({ app });

// This was defaulted to true... What does it do?
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// I don't need this for graphql, only rest api
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
});
