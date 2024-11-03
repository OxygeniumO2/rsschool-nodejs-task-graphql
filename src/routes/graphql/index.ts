import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, GraphQLError, Kind, parse, visit } from 'graphql';
import { checkDepth } from './checkDepth.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      try {
        const parsedQuery = parse(req.body.query);

        checkDepth(parsedQuery);

        return await graphql({
          schema: schema,
          source: req.body.query,
          variableValues: req.body.variables,
          contextValue: {
            prisma,
          },
        });
      } catch (err) {
        if (err instanceof GraphQLError) {
          return {
            data: null,
            errors: [{ type: 'DepthLimitExceeded', message: err.message }],
          };
        }
      }
    },
  });
};

export default plugin;
