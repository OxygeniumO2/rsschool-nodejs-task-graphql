import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  GraphQLContext,
  MemberTypeId,
  PostType,
  ProfileType,
  UserType,
} from './RootQueryType.js';
import { UUIDType } from './uuid.js';

interface CreateUserArgs {
  dto: {
    name: string;
    balance: number;
  };
}

interface CreateProfileArgs {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
  };
}

interface CreatePostArgs {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}

interface ChangePostArgs {
  id: string;
  dto: {
    title?: string;
    content?: string;
  };
}

interface ChangeProfileArgs {
  id: string;
  dto: {
    isMale?: boolean;
    yearOfBirth?: number;
    memberTypeId?: string;
  };
}

interface ChangeUserArgs {
  id: string;
  dto: {
    name?: string;
    balance?: number;
  };
}

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

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
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: {
          type: CreateProfileInput,
        },
      },
      resolve: (_, args: CreateProfileArgs, context: GraphQLContext) => {
        return context.prisma.profile.create({
          data: args.dto,
        });
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: {
          type: CreatePostInput,
        },
      },
      resolve: (_, args: CreatePostArgs, context: GraphQLContext) => {
        return context.prisma.post.create({
          data: args.dto,
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: ChangePostInput,
        },
      },
      resolve: (_, args: ChangePostArgs, context: GraphQLContext) => {
        return context.prisma.post.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: ChangeProfileInput,
        },
      },
      resolve: (_, args: ChangeProfileArgs, context: GraphQLContext) => {
        return context.prisma.profile.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: ChangeUserInput,
        },
      },
      resolve: (_, args: ChangeUserArgs, context: GraphQLContext) => {
        return context.prisma.user.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
        return 'User Deleted';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.post.delete({
          where: {
            id: args.id,
          },
        });
        return 'Post Deleted';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
        return 'Profile Deleted';
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _,
        args: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
        return 'Subscribed';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _,
        args: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return 'Unsubscribed';
      },
    },
  }),
});
