// GraphQL Schema

import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { resolvers } from './resolvers'

const typeDefs = `
type MetricMeta {
   id: ID!                # "!" denotes a required field
   title: String
   deprecated: Boolean
   tags: String
   isProduction: Boolean
   updated: String
}

# A GoodData metric returning a single value
type Metric {
    id: ID!
    title: String
    format: String      # GoodData format specifier
    data: Float
}

# This type specifies the entry points into the API.
type Query {
   metrics: [MetricMeta]    # A list of Metrics
   metric(id: ID!): Metric
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
//addMockFunctionsToSchema({ schema });
export { schema };