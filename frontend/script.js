const API_URL = "http://localhost:3000/employees";


const employeeForm =
    document.getElementById("employeeForm");

const employeeId =
    document.getElementById("employeeId");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const salaryInput =
    document.getElementById("salary");

const employeeTable =
    document.getElementById("employeeTable");

const searchInput =
    document.getElementById("search");

const submitBtn =
    document.getElementById("submitBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const formTitle =
    document.getElementById("formTitle");


let employees = [];


// ========================================
// GET ALL EMPLOYEES
// ========================================

async function getEmployees() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to fetch employees"
            );

        }


        employees =
            await response.json();


        displayEmployees(employees);


    } catch (error) {

        console.error(error);

        employeeTable.innerHTML = `
            <tr>
                <td colspan="5"
                    class="empty-message">

                    Unable to load employees.

                </td>
            </tr>
        `;

    }

}


// ========================================
// DISPLAY EMPLOYEES
// ========================================

function displayEmployees(data) {

    employeeTable.innerHTML = "";


    if (data.length === 0) {

        employeeTable.innerHTML = `
            <tr>
                <td colspan="5"
                    class="empty-message">

                    No employees found.

                </td>
            </tr>
        `;

        return;
    }


    data.forEach(employee => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${employee.id}
            </td>


            <td>
                ${employee.name}
            </td>


            <td>
                ${employee.email}
            </td>


            <td>
                ₹${Number(employee.salary).toLocaleString("en-IN")}
            </td>


            <td>

                <button
                    class="edit-btn"
                    onclick="editEmployee(${employee.id})">

                    Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteEmployee(${employee.id})">

                    Delete

                </button>

            </td>

        `;


        employeeTable.appendChild(row);

    });

}


// ========================================
// ADD / UPDATE EMPLOYEE
// ========================================

employeeForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            nameInput.value.trim();


        const email =
            emailInput.value.trim();


        const salary =
            salaryInput.value;


        if (!name || !email || !salary) {

            alert(
                "Please fill all fields"
            );

            return;

        }


        const employee = {

            name: name,

            email: email,

            salary: salary

        };


        try {

            let response;


            // =================================
            // UPDATE
            // =================================

            if (employeeId.value) {

                response =
                    await fetch(
                        `${API_URL}/${employeeId.value}`,

                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(employee)
                        }
                    );

            }


            // =================================
            // ADD
            // =================================

            else {

                response =
                    await fetch(
                        API_URL,

                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(employee)
                        }
                    );

            }


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Something went wrong"
                );

                return;

            }


            alert(data.message);


            resetForm();


            await getEmployees();


        } catch (error) {

            console.error(error);

            alert(
                "Server se connection nahi ho raha."
            );

        }

    }
);


// ========================================
// EDIT EMPLOYEE
// ========================================

function editEmployee(id) {

    const employee =
        employees.find(
            emp => emp.id === id
        );


    if (!employee) {

        alert(
            "Employee not found"
        );

        return;

    }


    employeeId.value =
        employee.id;


    nameInput.value =
        employee.name;


    emailInput.value =
        employee.email;


    salaryInput.value =
        employee.salary;


    formTitle.textContent =
        "Update Employee";


    submitBtn.textContent =
        "Update Employee";


    cancelBtn.style.display =
        "inline-block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// DELETE EMPLOYEE
// ========================================

async function deleteEmployee(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,

                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Delete failed"
            );

            return;

        }


        alert(data.message);


        await getEmployees();


    } catch (error) {

        console.error(error);

        alert(
            "Server se connection nahi ho raha."
        );

    }

}


// ========================================
// SEARCH EMPLOYEES
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredEmployees =
            employees.filter(employee => {

                return (

                    employee.name
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.email
                        .toLowerCase()
                        .includes(searchValue)

                );

            });


        displayEmployees(
            filteredEmployees
        );

    }
);


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    employeeForm.reset();


    employeeId.value = "";


    formTitle.textContent =
        "Add Employee";


    submitBtn.textContent =
        "Add Employee";


    cancelBtn.style.display =
        "none";

}


// ========================================
// CANCEL UPDATE
// ========================================

cancelBtn.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


// ========================================
// INITIAL LOAD
// ========================================

getEmployees();