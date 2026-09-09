var db = require('../config/config');
var { IsEmpty } = require('../helper/validation');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
const SECRET_KEY = process.env.SECRET_KEY;

const login = async (req,res) => {
    try{
        const { email, password } = req.body;
        if(IsEmpty(email)){
            return res.status(400).send({
                message: 'Email is required'
            })
        }
        if(IsEmpty(password)){
            return res.status(400).send({
                message: 'Password is required'
            })
        }
        const SelectSQL = `SELECT * FROM users WHERE email = '${email}'`;
        const [result] = await db.query(SelectSQL);
        if(result.length === 0){
            return res.status(404).send({
                message: 'Email not found'
            })
        }
        const dbPassword = result[0].password;
        const isMatch = bcrypt.compareSync(password,dbPassword);
        if(!isMatch){
            return res.status(401).send({
                message : 'Invalid password'
            })
        }
        const token = jwt.sign(
            {email : result[0].email},
            SECRET_KEY , { expiresIn: '1hr'}
        );
        return res.send({
            message: 'Login Successfully',
            token: token
        })
    }
    catch(error){
        return res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}

module.exports = {login}