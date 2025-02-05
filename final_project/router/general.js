const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let addUser = require("./auth_users.js").addUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({message: "provide username and password"});
    }
    users.forEach((user)=>{
        if(user.username === username){
            return res.status(400).json({message: "username already exists"});
        }
    })
    addUser(username, password);
    return res.status(201).send();
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if(!book){
    return res.status(404).json({message: "Book Not Found"});
  }
  return res.json(book);
 });
 

const searchBooks = (key, value) => {
    const result = {};
    Object.keys(books).forEach((bookKey)=>{
        const book = books[bookKey];
        if(book[key] === value){
            result[bookKey] = book;
        }
    })
    return result;
}
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = searchBooks('author', author);
  return res.json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const result = searchBooks('title', title);
    return res.json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    if(book){
        return res.json(book.reviews);
    }
    return res.status(404).send({message: "book not found"});
});

module.exports.general = public_users;
