import { DocumentNode, GraphQLError, Kind, visit } from 'graphql';

export const checkDepth = (query: DocumentNode) => {
  let depth = 0;

  visit(query, {
    enter: (node) => {
      if (node.kind === Kind.FIELD) {
        depth += 1;
      }

      if (depth > 5) {
        throw new GraphQLError('exceeds maximum operation depth of 5');
      }
    },
    leave: (node) => {
      if (node.kind === Kind.FIELD) {
        depth -= 1;
      }
    },
  });
};
