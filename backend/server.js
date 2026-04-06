const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const connectDB = require('./config/db');
const app = require('./app');

// Connect to Database
connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
