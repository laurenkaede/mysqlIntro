const express = require("express");
const mysql = require("mysql");
const path = require("path");
const methodOverride = require("method-override");
const app = express();

const publicDirectory = path.join(__dirname, "./public");
app.set("view engine", "hbs");

app.use(express.static(publicDirectory));
app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride('_method'));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 8889,
  database: "node-mysql",
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected");
  }
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM users", (error, result) => {
    if (error) {
      console.log("Error in the query");
    } else {
    //   console.log(result[1].user_name);

      res.render('index', {
          data: result
      });
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register/user", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  let sql = "INSERT INTO users SET user_name = ?, email = ?, user_password = ?";
  let user = [name, email, password];

  db.query(sql, user, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.send("<h1>User Registered</h1");
    }
  });
});

app.put('/edit/:id', (req, res) => {
    console.log(req.params.id)

    const name = req.body.editName;
    const id = req.params.id;

    let sql = 'UPDATE users SET user_name = ? WHERE id= ?'; 
    let user = [name, id];
    
    db.query(sql, user, (error, result) => {
        if(error) {
            console.log('There is an error');
        } else {
            res.send('<h1>User Name Updated</h1>');
        }
    }); 
});

app.delete('/delete/:id', (req, res) => {

    const id = req.params.id;

    let sql = 'DELETE FROM users WHERE id= ?'; 
    let user = [id];
    
    db.query(sql, user, (error, result) => {
        if(error) {
            console.log('There is an error');
        } else {
            res.send('<h1>User has been deleted</h1>');
        }
    }); 
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
