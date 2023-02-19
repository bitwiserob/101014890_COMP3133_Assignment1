const { User, Employee } = require("../models.js");
const { GraphQLError } = require("graphql");
const { UserInputError, AuthenticationError  } = require('apollo-server-errors');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret } = require("../config.js");
const { ObjectId } = require('mongodb');
const resolvers = {
  Query: {
    getAllEmployees: async () => {
      try {
        const allEmployees = await Employee.find(
          {},
          {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            department: 1,
            salary: 1,
            gender: 1,
          }
        );
        return allEmployees;
      } catch (err) {
        console.log(err);
        throw new Error("Error retrieving all employees");
      }
    },
    searchEmployeeById: async (_, { _id }) => {
      const employee = await Employee.findById(_id);
      if (!employee)
        throw new GraphQLError("Employee with this ID does not exist");

      return employee;

    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("A user with this email already exists");
        }
        existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("A user with this username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        return {
          user,
          token,
        };
      } catch (error) {
        if (error.name === "ValidationError") {
          const errors = Object.values(error.errors).map((err) => err.message);
          throw new UserInputError("Validation Error", { errors });
        }
        throw error;
      }
    },
    addNewEmployee: async (_, { first_name, last_name, email, gender, salary }) => {
      try {
        let existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
          return {
            success: false,
            message: "Employee with this email already exists",
          }
        }

        const employee = new Employee({
          first_name,
          last_name,
          email,
          gender,
          salary,
        });

        const savedEmployee = await employee.save();

        return {
          success: true,
          message: "Employee added",
          employee: savedEmployee,
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: err.message,
        };
      }
    },
    updateEmployeeById: async (
      _,
      { _id, first_name, last_name, email, gender, salary }
    ) => {
      try {
        const employee = await Employee.findById(_id);
        if (!employee) {
          throw new Error("Employee not found");
        }

        if (first_name) {
          employee.first_name = first_name;
        }
        if (last_name) {
          employee.last_name = last_name;
        }
        if (email) {
          employee.email = email;
        }
        if (gender) {
          employee.gender = gender;
        }
        if (salary) {
          employee.salary = salary;
        }

        const updatedEmployee = await employee.save();
        return updatedEmployee;
      } catch (error) {
        throw new Error(`Failed to update employee: ${error.message}`);
      }
    },
    deleteEmployeeById: async (_, { _id }) => {
      const deletedEmployee = await Employee.findByIdAndDelete(_id);
      if(!deletedEmployee){
        throw new Error(`Emplooyee with id ${_id} does not exist`);
        
      }
      return {
        success: true,
        message: "Employee deleted",
        employee: deletedEmployee,
      };

      
    },
    login: async (_, { email, password }, { res }) => {
      
      try {
        const user = await User.findOne({ email }, "+password");
        
        if (!user) {
          throw new AuthenticationError('Invalid login credentials');
        }
    
        const validPassword = await bcrypt.compare(password, user.password);
    
        if (!validPassword) {
          throw new AuthenticationError('Invalid login credentials');
        }
    
        const token = jwt.sign({ userId: user._id }, jwtSecret);
    
        return {
          user: {
            username: user.username,
            email: user.email
          },
          token
        };
      } catch (err) {
        if (err instanceof AuthenticationError) {
          throw err;
        }
        throw new AuthenticationError('An unknown error occurred');
      }
    }
  },
};

module.exports = resolvers;
