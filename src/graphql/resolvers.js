const { User, Employee } = require("../models.js");
const { GraphQLError } = require("graphql");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret } = require("../config.js");

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
      try {
        const employee = await Employee.findById(_id);
        if (!employee)
          throw new GraphQLError("Employee not found", {
            extensions: {
              code: "EMPLOYEE_NOT_FOUND",

            },
          });

        return employee;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('A user with this email already exists');
        }
        existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('A user with this username already exists');
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
  
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        return {
          user,
          token
        };
      } catch (error) {
        if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map((err) => err.message);
          throw new UserInputError('Validation Error', { errors });
        }
        throw error;
      }
    },
    addNewEmployee: async (
      _,
      { first_name, last_name, email, gender, salary }
    ) => {
      try {
        const employee = new Employee({
          first_name,
          last_name,
          email,
          gender,
          salary,
        });
        await employee.save();
          return {
              success: true,
              message: 'Employee added',
              employee
          };
      } catch (err) {
          console.log(err)
          return{
              success:false,
              message: err.message
          }
      }
    },
    updateEmployeeById: async (_, { _id, first_name, last_name, email, gender, salary }) => {
      try {
        const employee = await Employee.findById(_id);
        if (!employee) {
          throw new Error('Employee not found');
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
      return deletedEmployee;
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("Invalid login credentials");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new GraphQLError("Invalid login credentials");
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret);

      return { user, token };
    },
  },
};

module.exports = resolvers;
