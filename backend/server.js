const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const connectDB = require('./config/db');
const app = require('./app');

// Connect to Database
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
