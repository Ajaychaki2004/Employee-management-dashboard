const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    department: String,
    designation: String,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    joiningDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);