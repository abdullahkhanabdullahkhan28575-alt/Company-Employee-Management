const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.send("Employee Management Server is Running!");
});


// =========================
// GET ALL EMPLOYEES
// =========================

app.get("/employees", (req, res) => {

    const sql = "SELECT * FROM employees ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);
    });
});


// =========================
// ADD EMPLOYEE
// =========================

app.post("/employees", (req, res) => {

    const { name, email, salary } = req.body;

    if (!name || !email || !salary) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO employees (name, email, salary)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, salary],
        (err, result) => {

            if (err) {

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
        }
    );
});


// =========================
// UPDATE EMPLOYEE
// =========================

app.put("/employees/:id", (req, res) => {

    const id = req.params.id;

    const { name, email, salary } = req.body;

    if (!name || !email || !salary) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        UPDATE employees
        SET name = ?, email = ?, salary = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, salary, id],
        (err, result) => {

            if (err) {
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
        }
    );
});


// =========================
// DELETE EMPLOYEE
// =========================

app.delete("/employees/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
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


// =========================
// START SERVER
// =========================

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});