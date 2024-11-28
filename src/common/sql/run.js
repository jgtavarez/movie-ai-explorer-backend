/* eslint-disable @typescript-eslint/no-var-requires */
// This script reads the truncate and backup SQL file and executes it using the TypeORM connection.
// You can run this script using the following command: `node src/common/sql/run.js`

const { createConnection } = require('typeorm');
const fs = require('fs');
require('dotenv').config();

async function runSqlScript() {
  try {
    // Create a database connection
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });
    // Read the truncate SQL file
    const truncateScript = fs.readFileSync(
      'src/common/sql/truncate.sql',
      'utf8',
    );

    // Execute the truncate SQL script
    await connection.query(truncateScript);

    // Read the backup SQL file
    const sqlScript = fs.readFileSync('src/common/sql/backup.sql', 'utf8');

    // Execute the backup SQL script
    await connection.query(sqlScript);

    // Close the database connection
    await connection.close();

    console.log('SQL script executed successfully.');
  } catch (error) {
    console.error('Error executing SQL script:', error);
  }
}

runSqlScript();
