const inquirer = require('inquirer');
const db = require('./db');

// Function to start the application
function start() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        default:
          console.log('Invalid action');
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  db.all('SELECT * FROM department', (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(rows);
    start();
  });
}

// Function to view all roles
function viewAllRoles() {
  db.all('SELECT * FROM role', (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(rows);
    start();
  });
}

// Function to view all employees
function viewAllEmployees() {
  db.all('SELECT * FROM employee', (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(rows);
    start();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      db.run('INSERT INTO department (name) VALUES (?)', [answer.name], (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Department added successfully!');
        start();
      });
    });
}

/// Function to add a role
function addRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'input',
          name: 'department_id',
          message: 'Enter the department ID for the role:',
        },
      ])
      .then((answer) => {
        db.run(
          'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
          [answer.title, answer.salary, answer.department_id],
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Role added successfully!');
            start();
          }
        );
      });
  }
  
  // Function to add an employee
  function addEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter the first name of the employee:',
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Enter the last name of the employee:',
        },
        {
          type: 'input',
          name: 'role_id',
          message: 'Enter the role ID for the employee:',
        },
        {
          type: 'input',
          name: 'manager_id',
          message: 'Enter the manager ID for the employee (leave blank if none):',
        },
      ])
      .then((answer) => {
        db.run(
          'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
          [answer.first_name, answer.last_name, answer.role_id, answer.manager_id || null],
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Employee added successfully!');
            start();
          }
        );
      });
  }
  
  // Function to update an employee role
  function updateEmployeeRole() {
    db.all('SELECT * FROM employee', (err, employees) => {
      if (err) {
        console.error(err);
        return;
      }
  
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
  
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to update:',
            choices: employeeChoices,
          },
          {
            type: 'input',
            name: 'newRoleId',
            message: 'Enter the new role ID for the employee:',
          },
        ])
        .then((answer) => {
          db.run(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [answer.newRoleId, answer.employeeId],
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('Employee role updated successfully!');
              start();
            }
          );
        });
    });
  }
  
// Start the application
start();
