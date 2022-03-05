const debug = require("debug");
const DEBUG = debug("dev");
const Service = require("../models/Service");

module.exports = {
  /**
   * create service
   * @param req
   * @param res
   * @param next
   */
  createService: async (req, res) => {
    try {
      const { serviceType, serviceName } = req.body;
      const file = await req.file;
      const isServiceExisits = await Service.findOne({
        serviceName: serviceName,
      });
      if (isServiceExisits) {
        return res.status(400).json({
          status: 0,
          message: "Service Already Exists!",
        });
      }
      const newService = new Service();
      newService.image = file?.path;
      newService.serviceType = serviceType;
      newService.serviceName = serviceName;
      await newService.save();
      res.status(200).json({
        status: 1,
        message: "New Service Created Successfully",
        data: { newService },
      });
    } catch (error) {
      return res.status(400).json({
        status: 0,
        message: "Service Creation Failed!",
        error: { error },
      });
    }
  },
  /**
   * Get All Services
   * @param req
   * @param res
   * @param next
   */
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find();

      res.status(200).json({
        status: 1,
        message: "Services Fetched Successfully",
        data: { services },
      });
    } catch (error) {
      return res.status(400).json({
        status: 0,
        message: "Services Fetched Failed!",
        error: { error },
      });
    }
  },
};
