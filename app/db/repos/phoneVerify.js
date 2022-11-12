const db = require("../createDatabase");

class PhoneVerify {

    create(data) {
        return new Promise((reslove , reject) => {
            let sql ='INSERT INTO phone_verification (id , phone, code, created_at) VALUES (?,?,?,?)'
    
            db.run(sql, [data.id ,data.phone, data.code, Date.now() ], function (err, innerResult) {
                if (err) return reject(err);
        
                reslove();
            });   

        })
    }

    findBy(field , value) {
        return new Promise((resolve , reject) => {

            db.get(`SELECT * FROM phone_verification WHERE ${field} = ?`, value , function(err , row) {
                if(err) return reject(err);
    
                resolve(row);
            });
    
        });
    }

    delete(id) {
        return new Promise((resolve , reject) => {
            db.get(`DELETE FROM phone_verification WHERE id = ?`, id , function(err , row) {
                if(err) return reject(err);
    
                resolve(true);
            });
        });
    }


    async getUniqueCode() {
        let code;

        do {
            code = Math.floor(100000 + Math.random() * 900000);        
        } while(! await this.checkIsCodeUnique(code));

        return code
    }

    checkIsCodeUnique(code) {
        return new Promise((resolve , reject) => {
            db.get(`SELECT * FROM phone_verification WHERE code = ?`, code , function(err , row) {
                if(err) return reject(err);
                
                resolve(row === undefined);
            });
        })

    } 

}

module.exports = new PhoneVerify();