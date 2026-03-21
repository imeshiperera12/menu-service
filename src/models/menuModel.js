const db = require("./db");

exports.createMenuItem = (item, callback) => {
  const {
    restaurantId,
    categoryId,
    name,
    description,
    price,
    isAvailable,
    vegan,
    imageUrl
  } = item;

  db.run(
    `INSERT INTO menu_items
    (restaurantId, categoryId, name, description, price, isAvailable, vegan, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      restaurantId,
      categoryId,
      name,
      description,
      price,
      isAvailable ? 1 : 0,
      vegan ? 1 : 0,
      imageUrl || null
    ],
    function (err) {
      callback(err, { id: this?.lastID });
    }
  );
};

exports.getAllMenuItems = (filters, callback) => {
  let query = `
    SELECT 
      m.id,
      m.name,
      m.description,
      m.price,
      m.isAvailable,
      m.vegan,
      m.imageUrl,
      m.restaurantId,
      r.name AS restaurantName,
      m.categoryId,
      c.name AS categoryName,
      m.createdAt,
      m.updatedAt
    FROM menu_items m
    JOIN restaurants r ON m.restaurantId = r.id
    JOIN categories c ON m.categoryId = c.id
    WHERE 1=1
  `;

  const params = [];

  if (filters.restaurantId) {
    query += ` AND m.restaurantId = ?`;
    params.push(filters.restaurantId);
  }

  if (filters.categoryId) {
    query += ` AND m.categoryId = ?`;
    params.push(filters.categoryId);
  }

  if (filters.isAvailable !== undefined) {
    query += ` AND m.isAvailable = ?`;
    params.push(filters.isAvailable === "true" ? 1 : 0);
  }

  if (filters.vegan !== undefined) {
    query += ` AND m.vegan = ?`;
    params.push(filters.vegan === "true" ? 1 : 0);
  }

  query += ` ORDER BY m.id DESC`;

  db.all(query, params, callback);
};

exports.getMenuItemById = (id, callback) => {
  db.get(
    `
    SELECT 
      m.id,
      m.name,
      m.description,
      m.price,
      m.isAvailable,
      m.vegan,
      m.imageUrl,
      m.restaurantId,
      r.name AS restaurantName,
      m.categoryId,
      c.name AS categoryName,
      m.createdAt,
      m.updatedAt
    FROM menu_items m
    JOIN restaurants r ON m.restaurantId = r.id
    JOIN categories c ON m.categoryId = c.id
    WHERE m.id = ?
    `,
    [id],
    callback
  );
};

exports.updateMenuItem = (id, item, callback) => {
  const {
    restaurantId,
    categoryId,
    name,
    description,
    price,
    isAvailable,
    vegan,
    imageUrl
  } = item;

  db.run(
    `UPDATE menu_items
     SET restaurantId = ?,
         categoryId = ?,
         name = ?,
         description = ?,
         price = ?,
         isAvailable = ?,
         vegan = ?,
         imageUrl = ?,
         updatedAt = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      restaurantId,
      categoryId,
      name,
      description,
      price,
      isAvailable ? 1 : 0,
      vegan ? 1 : 0,
      imageUrl || null,
      id
    ],
    function (err) {
      callback(err, { changes: this?.changes });
    }
  );
};

exports.deleteMenuItem = (id, callback) => {
  db.run(`DELETE FROM menu_items WHERE id = ?`, [id], function (err) {
    callback(err, { changes: this?.changes });
  });
};

exports.validateItemsForOrder = (items, callback) => {
  if (!items || !items.length) {
    return callback(null, []);
  }

  const ids = items.map((item) => item.menuItemId);
  const placeholders = ids.map(() => "?").join(",");

  db.all(
    `
    SELECT id, name, price, isAvailable, vegan
    FROM menu_items
    WHERE id IN (${placeholders})
    `,
    ids,
    callback
  );
};

exports.getCategories = (callback) => {
  db.all(`SELECT * FROM categories ORDER BY name ASC`, callback);
};

exports.getRestaurants = (callback) => {
  db.all(`SELECT * FROM restaurants WHERE isActive = 1 ORDER BY name ASC`, callback);
};