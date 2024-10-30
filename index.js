const express = require('express');
const { check, validationResult } = require('express-validator');
const { createConnection } = require('typeorm');
const { EmployeeDetails } = require('../web/modal/employeeDetails'); 

const dbConfig = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: 3306,
  username: 'root',
  password: 'blaze.ws',
  database: 'Benz',
  synchronize: false,
  logging: process.env.TYPEORM_LOG_QUERY === 'true' || false,
  entities: [EmployeeDetails], 
};

createConnection(dbConfig)
  .then(connection => {
    const app = express();
    const port = 3000;

    app.use(express.json()); 

    app.get('/', (req, res) => {
      res.send('<h1>Welcome to Express!</h1>');
    });

    app.post('/empdetail', [
      // Validation checks
      check('name').notEmpty().withMessage('Name is required').isLength({ max: 30 }).withMessage('Name must be less than 30 characters'),
      check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').isLength({ max: 50 }).withMessage('Email must be less than 50 characters'),
      check('phoneNumber').optional().isLength({ max: 15 }).withMessage('Phone number must be less than 15 characters').matches(/^[0-9]+$/).withMessage('Phone number must contain only numbers'),
    ], async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const formData = req.body;

        const result = await connection.manager.save(EmployeeDetails, {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phoneNumber,
        });

        res.json({ message: 'Form submitted!', data: result });
      } catch (error) {
        console.error('Error saving employee:', error);
        res.status(500).json({ message: 'Error saving employee data.' });
      }
    });

    app.use((req, res) => {
      res.status(404).send('404: Page not found');
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });
