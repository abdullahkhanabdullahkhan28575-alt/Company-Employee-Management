const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors({
    origin: "https://company-employeemanagement.netlify.app"
}));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Employee Management Server is Running!");
});

// GET all employees
app.get("/employees", (req, res) => {
    const sql = "SELECT * FROM employees ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("GET EMPLOYEES ERROR:", err);

            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json(result);
    });
});

// ADD employee
app.post("/employees", (req, res) => {
    const { name, email, salary } = req.body;

    if (!name || !email || salary === undefined || salary === null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO employees (name, email, salary)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, salary], (err, result) => {
        if (err) {
            console.error("ADD EMPLOYEE ERROR:", err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            return res.status(500).json({
                message: "Failed to add employee"
            });
        }

        res.status(201).json({
            message: "Employee added successfully",
            id: result.insertId
        });
    });
});

// UPDATE employee
app.put("/employees/:id", (req, res) => {
    const id = req.params.id;
    const { name, email, salary } = req.body;

    if (!name || !email || salary === undefined || salary === null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        UPDATE employees
        SET name = ?, email = ?, salary = ?
        WHERE id = ?
    `;

    db.query(sql, [name, email, salary, id], (err, result) => {
        if (err) {
            console.error("UPDATE EMPLOYEE ERROR:", err);

            return res.status(500).json({
                message: "Failed to update employee"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee updated successfully"
        });
    });
});

// DELETE employee
app.delete("/employees/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("DELETE EMPLOYEE ERROR:", err);

            return res.status(500).json({
                message: "Failed to delete employee"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee deleted successfully"
        });
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
