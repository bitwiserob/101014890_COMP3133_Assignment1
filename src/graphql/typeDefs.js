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

    type Response{
        success:Boolean!
        message: String!
        status: Int!
        errors: [String]
    }

    type EmployeeResponse {
      success: Boolean!
      message: String!
      employee: Employee
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
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addNewEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      salary: Float!
    ): EmployeeResponse!
    updateEmployeeById(
      _id: ID!
      first_name: String
      last_name: String
      email: String
      gender: String
      salary: Float
    ): Employee
    deleteEmployeeById(_id: String!): EmployeeResponse!
  }
`;

module.exports = typeDefs;
