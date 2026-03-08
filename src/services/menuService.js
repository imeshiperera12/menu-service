const menuModel = require("../models/menuModel");

exports.createMenuItem = (item, cb) => {
  menuModel.createMenuItem(item, cb);
};

exports.getAllMenuItems = (filters, cb) => {
  menuModel.getAllMenuItems(filters, cb);
};

exports.getMenuItemById = (id, cb) => {
  menuModel.getMenuItemById(id, cb);
};

exports.updateMenuItem = (id, item, cb) => {
  menuModel.updateMenuItem(id, item, cb);
};

exports.deleteMenuItem = (id, cb) => {
  menuModel.deleteMenuItem(id, cb);
};

exports.validateItemsForOrder = (items, cb) => {
  menuModel.validateItemsForOrder(items, cb);
};

exports.getCategories = (cb) => {
  menuModel.getCategories(cb);
};

exports.getRestaurants = (cb) => {
  menuModel.getRestaurants(cb);
};