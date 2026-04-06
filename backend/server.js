const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const cors = require("cors");

const connectDB = require('./config/db');
const app = require('./app');
app.use(cors({
  origin: "https://healthtech-dashboard-1.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Connect to Database
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
