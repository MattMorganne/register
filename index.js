const express = require("express");
const userRoutes = require("./routes/userRoutes"); // Import user routes

const app = express();

// Middleware to parse incoming JSON payloads (required for req.body)
app.use(express.json());

// Declaring port
const port = 3000;

// Calculator routes
app.get("/", (req, res) => {
    res.send("Welcome to my calculator app");
});

app.get("/add/:num1/:num2", (req, res) => {
    const { num1, num2 } = req.params;
    const sum = parseFloat(num1) + parseFloat(num2);
    res.send(`The sum of ${num1} and ${num2} is ${sum}`);
});

// User routes (mounted on /users)
app.use("/users", userRoutes);

// Listening app
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});