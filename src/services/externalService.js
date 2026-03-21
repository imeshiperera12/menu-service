const axios = require("axios");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

exports.getUserPreference = async (userId) => {
  const response = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
  const user = response.data?.data || response.data || {};

  return {
    raw: response.data,
    vegan: !!user.vegan
  };
};

exports.getIntegrationStatus = async () => {
  const result = {
    userService: { status: "down" },
    orderService: { status: "down" }
  };

  try {
    const userResponse = await axios.get(`${USER_SERVICE_URL}/api/users/ping`);
    result.userService = {
      status: "up",
      response: userResponse.data
    };
  } catch (error) {
    result.userService = {
      status: "down",
      error: error.message
    };
  }

  try {
    const orderResponse = await axios.get(`${ORDER_SERVICE_URL}/orders`);
    result.orderService = {
      status: "up",
      note: "Connected successfully",
      responseType: Array.isArray(orderResponse.data) ? "array" : typeof orderResponse.data
    };
  } catch (error) {
    result.orderService = {
      status: "down",
      error: error.message
    };
  }

  return result;
};