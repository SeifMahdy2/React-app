import mysql from "mysql";
//connecting to mysql workbench
export const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '112233',
  database: 'social',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

// Close the database connection when the Node.js process exits
process.on('exit', () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
      return;
    }
    console.log('Database connection closed');
  });
});
