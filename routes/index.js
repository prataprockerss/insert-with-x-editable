const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sample"
});

connection.connect(function(err, status) {
    if (err) {
        throw err;
    } else {
        console.log(`DB connected`);
    }
});

/* GET home page. */
router.get("/", async function(req, res, next) {
    connection.query(
        `
            SELECT 
                u.id as user_id,
				CONCAT(u.first_name," ", u.last_name) as name, u.mobile,u.email,
                IFNULL(r.role, "NA") as role,
                ur.role_id,
                ur.id as user_has_role_id
			FROM 
				user u
			LEFT JOIN 
				user_has_role ur
			ON 
				ur.user_id = u.id
			LEFT JOIN 
				role r
			ON 
				ur.role_id = r.id
        `,
        function(err, rows) {
            let options = { title: "Express" };
            if (err) {
                options.error = err.message;
            } else {
                options.users = rows;
            }
            res.render("index", options);
        }
    );
});

router.post("/user/update-role", function(req, res) {
    let { value, pk, type, user_id } = req.body;
    if (type == "INSERT") {
        let data = {
            user_id,
            role_id: value
        };
        connection.query(
            `INSERT INTO user_has_role SET ?`,
            data,
            function(err, status) {
                if (err) {
                    console.log(err)
                    res.status(503).send(err.message);
                } else {
                    res.status(200).send(status);
                }
            }
        );
    } else {
        
        connection.query(
            `UPDATE user_has_role SET role_id = ? WHERE id = ?`,
            [value, pk],
            function(err, status) {
                if (err) {
                    console.log(err);
                    res.status(503).send(err);
                } else {
                    res.send(`updated success`);
                }
            }
        );
    }
});

module.exports = router;
