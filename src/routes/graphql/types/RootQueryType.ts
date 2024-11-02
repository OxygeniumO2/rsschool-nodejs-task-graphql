// type RootQueryType {
//   memberTypes: [MemberType!]!
//   memberType(id: MemberTypeId!): MemberType
//   users: [User!]!
//   user(id: UUID!): User
//   posts: [Post!]!
//   post(id: UUID!): Post
//   profiles: [Profile!]!
//   profile(id: UUID!): Profile
// }

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

interface GraphQLContext {
  prisma: PrismaClient;
}

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_, __, context: GraphQLContext) => {
        console.log('ssassss');
        return await context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType as unknown as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
    },
    posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))) },
    post: { type: PostType, args: { id: { type: new GraphQLNonNull(UUIDType) } } },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
    },
    profile: { type: ProfileType, args: { id: { type: new GraphQLNonNull(UUIDType) } } },
  }),
});

// type User {
//   id: UUID!
//   name: String!
//   balance: Float!
//   profile: Profile
//   posts: [Post!]!
//   userSubscribedTo: [User!]!
//   subscribedToUser: [User!]!
// }

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: { type: ProfileType },
    posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))) },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    },
  }),
});

// type Profile {
//   id: UUID!
//   isMale: Boolean!
//   yearOfBirth: Int!
//   memberType: MemberType!
// }

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: { type: new GraphQLNonNull(MemberType) },
  }),
});

// type MemberType {
//   id: MemberTypeId!
//   discount: Float!
//   postsLimitPerMonth: Int!
// }

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

// enum MemberTypeId {
//   BASIC
//   BUSINESS
// }

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

// type Post {
//   id: UUID!
//   title: String!
//   content: String!
// }

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
