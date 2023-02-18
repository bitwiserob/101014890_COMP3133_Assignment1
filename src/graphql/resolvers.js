const { User, Employee } = require("../models.js");
const resolvers = {
  Query: {
    getAllEmployees: async () => {
      try {
        const allEmployees = await Employee.find({});
        return allEmployees;
      } catch (err) {
        console.log(err);
        throw new Error("Error retrieving all employees");
      }
    },
    searchEmployeeById: (_, { eid }) => {
      // TODO: retrieve employee with matching eid from database or other data source
    },
  },
  Mutation: {
    signup: (_, { name, email, password }) => {
      // TODO: create a new user with the provided name, email, and password in the database, and return a token or session ID
    },
    addNewEmployee: (_, { name, email, department, salary }) => {
      // TODO: create a new employee with the provided name, email, department, and salary in the database, and return the new employee object
    },
    updateEmployeeById: (_, { eid, name, email, department, salary }) => {
      // TODO: update the employee with matching eid with the provided name, email, department, and salary in the database, and return the updated employee object
    },
    deleteEmployeeById: (_, { eid }) => {
      // TODO: delete the employee with matching eid from the database, and return a success message
    },
    login: (_, { email, password }) => {
      // TODO: check if email and password match a user in the database, and return a token or session ID if successful
    },
  },
};

module.exports = resolvers;
