const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./company.db');

db.serialize(() => {
  // Create department table
  db.run(`
    CREATE TABLE IF NOT EXISTS department (
      id INTEGER PRIMARY KEY,
      name VARCHAR(30)
    )
  `);

  // Create role table
  db.run(`
    CREATE TABLE IF NOT EXISTS role (
      id INTEGER PRIMARY KEY,
      title VARCHAR(30),
      salary DECIMAL,
      department_id INTEGER,
      FOREIGN KEY (department_id) REFERENCES department(id)
    )
  `);

  // Create employee table
  db.run(`
    CREATE TABLE IF NOT EXISTS employee (
      id INTEGER PRIMARY KEY,
      first_name VARCHAR(30),
      last_name VARCHAR(30),
      role_id INTEGER,
      manager_id INTEGER,
      FOREIGN KEY (role_id) REFERENCES role(id),
      FOREIGN KEY (manager_id) REFERENCES employee(id)
    )
  `);
});

module.exports = db;
