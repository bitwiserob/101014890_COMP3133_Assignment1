const { User, Employee } = require("../models.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config.js');

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
    searchEmployeeById: async (_, { _id }) => {
      try {
        const employee = await Employee.findById(_id);
        if(!employee) throw new Error("Employee not found");
        return employee;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ userId: user._id },jwtSecret);
        return { user, token };
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    addNewEmployee: async (_, { first_name, last_name, email, gender, salary }) => {
      try {
        const employee = new Employee({
          first_name,
          last_name,
          email,
          gender,
          salary,
        });
        await employee.save();
        return employee;
      } catch (err) {
        throw new Error(err);
      }
    },
    updateEmployeeById: (_, { id, name, email, department, salary }) => {
      // TODO: update the employee with matching id with the provided name, email, department, and salary in the database, and return the updated employee object
    },
    deleteEmployeeById: (_, { id }) => {
      // TODO: delete the employee with matching id from the database, and return a success message
    },
    login: (_, { email, password }) => {
      // TODO: check if email and password match a user in the database, and return a token or session ID if successful
    },
  },
};

module.exports = resolvers;
