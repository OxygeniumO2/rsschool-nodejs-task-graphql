import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLContext, UserType } from './RootQueryType.js';

// type Mutations {
//   createUser(dto: CreateUserInput!): User!
//   createProfile(dto: CreateProfileInput!): Profile!
//   createPost(dto: CreatePostInput!): Post!
//   changePost(id: UUID!, dto: ChangePostInput!): Post!
//   changeProfile(id: UUID!, dto: ChangeProfileInput!): Profile!
//   changeUser(id: UUID!, dto: ChangeUserInput!): User!
//   deleteUser(id: UUID!): String!
//   deletePost(id: UUID!): String!
//   deleteProfile(id: UUID!): String!
//   subscribeTo(userId: UUID!, authorId: UUID!): String!
//   unsubscribeFrom(userId: UUID!, authorId: UUID!): String!
// }

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

interface CreateUserArgs {
  dto: {
    name: string;
    balance: number;
  };
}

export const MutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: {
          type: CreateUserInput,
        },
      },
      resolve: (_, args: CreateUserArgs, context: GraphQLContext) => {
        return context.prisma.user.create({
          data: args.dto,
        });
      },
    },
  }),
});
