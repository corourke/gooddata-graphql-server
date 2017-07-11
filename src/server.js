// Copyright (C) 2017, GoodData(R) Corporation. All rights reserved.

import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { schema } from './schema';

const PORT = 4000;

const server = express();

server.get('/', function (req, res) {
  res.send(`
  <h3>GoodData GraphQL Server</h3>
  <p>Endpoints:</p>
  <ul>
    <li><a href="/graphql">/graphql</a></li>
    <li><a href="graphiql">/graphiql</a></li>
</ul>
  `);
});

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    query: `
{
  metric(id: "adlts78WhfEv") {
    title
    id
    format
    data
  },
  metrics {
    id
    title
  }
}
`
}));

server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
