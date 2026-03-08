const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const db = new sqlite3.Database(process.env.DB_FILE || "menu.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      isActive INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurantId INTEGER NOT NULL,
      categoryId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      isAvailable INTEGER DEFAULT 1,
      imageUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO categories (id, name) VALUES
    (1, 'Burgers'),
    (2, 'Pizza'),
    (3, 'Drinks'),
    (4, 'Desserts')
  `);

  db.run(`
    INSERT OR IGNORE INTO restaurants (id, name, location, isActive) VALUES
    (1, 'Food Hub', 'Colombo', 1),
    (2, 'City Bites', 'Malabe', 1)
  `);
});

module.exports = db;