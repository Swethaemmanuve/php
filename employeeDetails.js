const { EntitySchema } = require('typeorm');

const EmployeeDetails = new EntitySchema({
  name: 'EmployeeDetails',
  tableName: 'employee_details', 
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 30,
    },
    email: {
      type: 'varchar',
      length: 30,
    },
    phone_number: {
      type: 'varchar',
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});

module.exports = { EmployeeDetails };