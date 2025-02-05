const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { isValid } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session){
        jwt.verify(req.session.accessToken, (err, decoded)=>{
            if(err || !isValid(decoded)){
                return res.status(401).send("you need to login first");
            }
            next();
        });
    }else{
        res.status(401).send("you need to login first");
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
