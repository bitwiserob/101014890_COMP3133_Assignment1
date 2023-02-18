
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  salary: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = {
  User,
  Employee,
};