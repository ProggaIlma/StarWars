import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await server.listen({
      port:  4000,
      cors: {
        origin: '*', // Allow all origins (use caution in production)
        credentials: true,
      },
    });

    console.log(`🚀 GraphQL server is running at ${url}`);
  } catch (error) {
    console.error('❌ Failed to start Apollo Server:', error.message);
    process.exit(1);
  }
};

startServer();

