const menuService = require("../services/menuService");
const externalService = require("../services/externalService");

exports.createMenuItem = (req, res) => {
  const { restaurantId, categoryId, name, price } = req.body;

  if (!restaurantId || !categoryId || !name || price === undefined) {
    return res.status(400).json({
      success: false,
      message: "restaurantId, categoryId, name and price are required"
    });
  }

  menuService.createMenuItem(req.body, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data
    });
  });
};

exports.getAllMenuItems = (req, res) => {
  menuService.getAllMenuItems(req.query, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({
      success: true,
      data: rows
    });
  });
};

exports.getMenuItemById = (req, res) => {
  menuService.getMenuItemById(req.params.id, (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    res.json({
      success: true,
      data: row
    });
  });
};

exports.updateMenuItem = (req, res) => {
  menuService.updateMenuItem(req.params.id, req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!result.changes) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully"
    });
  });
};

exports.deleteMenuItem = (req, res) => {
  menuService.deleteMenuItem(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!result.changes) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully"
    });
  });
};

exports.validateItemsForOrder = (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || !items.length) {
    return res.status(400).json({
      success: false,
      message: "items array is required"
    });
  }

  menuService.validateItemsForOrder(items, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const requestedMap = new Map(items.map((item) => [item.menuItemId, item.quantity]));

    const validated = rows.map((row) => ({
      menuItemId: row.id,
      name: row.name,
      quantity: requestedMap.get(row.id),
      currentPrice: row.price,
      vegan: !!row.vegan,
      isAvailable: !!row.isAvailable
    }));

    const allAvailable = validated.every((item) => item.isAvailable);

    res.json({
      success: true,
      allAvailable,
      data: validated
    });
  });
};

exports.getCategories = (req, res) => {
  menuService.getCategories((err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({
      success: true,
      data: rows
    });
  });
};

exports.getRestaurants = (req, res) => {
  menuService.getRestaurants((err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    res.json({
      success: true,
      data: rows
    });
  });
};

exports.getPersonalizedMenu = async (req, res) => {
  try {
    const { userId } = req.params;
    const userInfo = await externalService.getUserPreference(userId);

    menuService.getAllMenuItems({}, (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      const filtered = rows.filter((item) => !!item.vegan === !!userInfo.vegan);

      res.json({
        success: true,
        userId,
        detectedVeganPreference: userInfo.vegan,
        totalItems: filtered.length,
        data: filtered
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch personalized menu",
      error: error.message
    });
  }
};

exports.getIntegrationStatus = async (req, res) => {
  try {
    const services = await externalService.getIntegrationStatus();

    res.json({
      success: true,
      message: "Integration status fetched successfully",
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch integration status",
      error: error.message
    });
  }
};