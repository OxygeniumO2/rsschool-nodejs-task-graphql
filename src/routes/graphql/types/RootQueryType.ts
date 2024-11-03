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

export interface GraphQLContext {
  prisma: PrismaClient;
}

interface UserArgs {
  id: string;
  memberTypeId?: string;
}

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_, __, context: GraphQLContext) => {
        return await context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: async (_, args: { id: string }, context: GraphQLContext) => {
        return await context.prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_, __, context: GraphQLContext) => {
        const users = await context.prisma.user.findMany();
        return users;
      },
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args: UserArgs, context: GraphQLContext) => {
        const user = await context.prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });

        return user;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_, __, context: GraphQLContext) => {
        return await context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args: UserArgs, context: GraphQLContext) => {
        const post = await context.prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        if (!post) return null;
        return post;
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: (_, __, context: GraphQLContext) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args: UserArgs, context: GraphQLContext) => {
        const profile = await context.prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });

        return profile;
      },
    },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user: UserArgs, _, context: GraphQLContext) => {
        const profile = await context.prisma.profile.findUnique({
          where: { userId: user.id },
        });

        return profile;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user, _, context: GraphQLContext) => {
        return await context.prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _, context: GraphQLContext) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: _parent.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _, context: GraphQLContext) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: _parent.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (_parent: UserArgs, _, context: GraphQLContext) => {
        return await context.prisma.memberType.findUnique({
          where: { id: _parent.memberTypeId },
        });
      },
    },
    userId: { type: UUIDType },
  }),
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: UUIDType },
  }),
});
