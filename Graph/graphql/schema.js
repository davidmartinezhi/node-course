const { buildSchema } = require('graphql'); //build a schema that could be parsed by graphql

// input type is used to define the input types for the mutation
// ID is a special type in graphql that is used to define the unique identifier for the object

// Query -> GET
// Mutation -> POST, PUT, PATCH, Update
// Subscription -> set up real time connections via web sockets

module.exports = buildSchema(`

    type Post{
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User{
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData{
        token: String!
        userId: ID!
    }

    type PostData{
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData{
        email: String!
        name: String!
        password: String!
    }

    input PostInputData{
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootMutation{
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
    }

    type RootQuery{
        login(email: String!, password: String!): AuthData!
        posts: PostData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);