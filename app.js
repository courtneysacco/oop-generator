const employee = require('./lib/Employee');
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
console.log('Build your team!');

const employees = [];

// questions

const questions = () => {
    return inquirer.prompt([
        {
            type: 'input',
            message: "Submit the employee's name:",
            name: 'name',
        },
        {
            type: 'input',
            message: "Submit the employee's ID number:",
            name: 'id',
        },
        {
            type: 'input',
            message: "Submit the employee's email address:",
            name: 'email',
        },
        {
            type: 'list',
            message: "Select the employee's role:",
            name: 'role',
            choices: ['Manager', 'Engineer', 'Intern'],
        },
        {
            // Manager occupation
            type: 'input',
            message: "Submit the manager's office number:",
            name: 'officeNumber',
            when: (answers) => answers.role === 'Manager',
        },
        {
            // Engineer occupation
            type: 'input',
            message: "Submit the engineer's GitHub user:",
            name: 'github',
            when: (answers) => answers.role === 'Engineer',
        },
        {
            // Intern occupation
            type: 'input',
            message: "Submit the school the intern attends:",
            name: 'school',
            when: (answers) => answers.role === 'Intern',
        },
        {
            // If the user selects 'Yes' to add another employee, the questions will run again
            type: 'confirm',
            message: 'Would you like to add another employee?',
            name: 'addEmployee',
        },
    ])
    .then((answers) => {
        let employee;

        if (answers.role === 'Manager') {
            employee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
        } else if (answers.role === 'Engineer') {
            employee = new Engineer(answers.name, answers.id, answers.email, answers.github);
        } else if (answers.role === 'Intern') {
            employee = new Intern(answers.name, answers.id, answers.email, answers.school);
        }
        
        employees.push(employee);
        if (answers.addEmployee) {
            return questions();
        } else {
            return employees;
        }
    })
}

function writeFileAsync(path, data) {
    return new Promise((resolve, reject) => {
        
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }
        
        fs.writeFile(path, data,function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

questions()
    .then((employees) => {
        return render(employees);
    })
    .then((html) => {
        return writeFileAsync(outputPath, html);
    })
    .then(() => {
        console.log('Creating team...');
    })
    .catch((err) => console.error(err));