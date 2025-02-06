const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const addUser = (username, password) => {
    console.log(users);
    if(!isValid(username)){
        users.push({username, password});
        return true;
    }
    return false;
}

const isValid = (username)=>{
    for(let u of users){
        if(u.username === username){
            return true;
        }
    }
    return false;
}

const authenticatedUser = (username,password)=>{ 
    for(let u of users){
        if(u.username === username && u.password === password){
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if(username && password){
        if(authenticatedUser(username, password)){
            let jwtToken = jwt.sign({
                username: username
              }, 'secret', { expiresIn: '1h' });
            req.session.accessToken = jwtToken;
            req.session.username = username;
            return res.json({message: 'user loggedIn successfully'});
        }else{
            return res.status(401).json({message: 'Wrong username or passwrod'});
        }
    }
    return res.status(400).json({message: 'please provide username and password'});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    if(!book){
        return res.status(404).json({message: 'Book not found'});
    }
    const {review} = req.body;
    if(!review || review.trim() === ''){
        return res.status(400).json({message: 'Please provide a review'});
    }
    const bookReviews = book.reviews;
    const username = req.session.username;
    bookReviews[username] = review;
    res.json({message: `Review added to book ${req.params.isbn}`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.addUser = addUser;
module.exports.users = users;
