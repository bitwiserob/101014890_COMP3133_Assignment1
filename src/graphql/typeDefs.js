const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    username: String
    email: String!
    password: String!
  }
  type AuthPayload {
    user: User!
    token: String!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    salary: Float!
  }

  type Query {
    getAllEmployees: [Employee!]!
    searchEmployeeById(_id: String!): Employee
    login(username: String!, password: String!): User
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(usernameOrEmail: String!, password: String!): String
    addNewEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      salary: Float!
    ): Employee
    updateEmployeeById(
      _id: ID!
      first_name: String
      last_name: String
      email: String
      gender: String
      salary: Float
    ): Employee
    deleteEmployeeById(id: String!): Boolean
  }
`;

module.exports = typeDefs;
