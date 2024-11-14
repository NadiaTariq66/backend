const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler=require("./middlewares/errorHandler");
const userRouter = require("./routes/user/user");

const app = express();

dotenv.config();  // Load environment variables from .env file

connectDB();  // Connect to MongoDB

app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.status(200).send({
        message: "server is running"
    });
});
// Add the errorHandler middleware as the last middleware
app.use(errorHandler);
app.use(userRouter);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
