const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const serviceTypes = [
  "Vehicle Repairs",
  "Gadget Repairs",
  "Appliances Repairs",
  "Furniture Repairs",
  "Home Repairs",
  "Office Repairs",
  "Agri Machinery Repairs",
  "Construction Repairs",
  "Bike Repairs",
  "Others Repairs",
];
const ServiceSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: serviceTypes,
    },
    serviceName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Service", ServiceSchema, "Services");
