const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    username: String!
    email: String!
    password: String!
  }

  type Employee {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    salary: Float!
  }

  type Query {
    getAllEmployees: [Employee!]!
    searchEmployeeById(eid: String!): Employee
    login(username: String!, password: String!): User
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(usernameOrEmail: String!, password: String!): String
    addNewEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String
      salary: Float!
    ): Employee
    updateEmployeeById(
      eid: String!
      first_name: String
      last_name: String
      email: String
      gender: String
      salary: Float
    ): Employee
    deleteEmployeeById(eid: String!): Boolean
  }
`;

module.exports = typeDefs;
