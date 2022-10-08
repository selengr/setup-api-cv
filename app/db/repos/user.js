const db = require("../createDatabase");

class User {

    create(data) {
        return new Promise((reslove , reject) => {
            let sql ='INSERT INTO users (name, email, password, salt, created_at) VALUES (?,?,?,?,?)'
    
            db.run(sql, [ data.name, data.email, data.password, data.salt, Date.now() ], function (err, innerResult) {
                if (err) return reject(err);
        
                reslove();
            });   

        })
    }

    findBy(field , email) {
        return new Promise((resolve , reject) => {

            db.get(`SELECT * FROM users WHERE ${field} = ?`, email , function(err , user) {
                if(err) return reject(err);
    
                resolve(user);
            });
    
        });
    }

    update(id , data) {
        let fieldMustUpdate = Object.keys(data).map(item => `${item}=$${item}` ).join(',');
        let fieldData = {};
        Object.keys(data).forEach(item => fieldData[`$${item}`] = data[item] )

        return new Promise((resolve , reject) => {

            db.run(`UPDATE users SET ${fieldMustUpdate} WHERE id = $id` , { $id : id  , ...fieldData} , function(err) {
                if(err) return reject(err)

                resolve()
            })
        });
    }
}

module.exports = new User();