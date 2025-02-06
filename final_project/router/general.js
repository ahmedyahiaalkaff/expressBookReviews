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
    
    if(addUser(username, password)){
        return res.status(201).send();    
    }
    return res.status(400).json({message: 'user already exists'});
});

const getBooks = ()=>{
    return new Promise((resolve, reject)=>{
        try{
            resolve(books);
        }catch(error){
            reject(error);
        }
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks().then((books)=>{
        return res.json(books);
    }).catch((error)=>{
        console.log("Error "+error);
        return res.status(500).json({message: 'Error retrieving books'});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getBooks().then((books)=>{
        const book = books[req.params.isbn];
        if(!book){
            return res.status(404).json({message: "Book Not Found"});
        }
        return res.json(book);
    }).catch((error)=>{
        console.log("Error "+error);
        return res.status(500).json({message: "Error Retrieving book"});
    })
 });
 

const searchBooks = (key, value) => {
    return new Promise((resolve, reject)=>{
        const result = {};
        Object.keys(books).forEach((bookKey)=>{
            const book = books[bookKey];
            if(book[key] === value){
                result[bookKey] = book;
            }
        })
        resolve(result);
    })
}
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  searchBooks('author', author).then((result)=>{
    return res.json(result);
  }).catch((error)=>{
    console.log("Error "+error);
    return res.status(500).json({message: 'Error searching for books'});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    searchBooks('title', title).then((result)=>{
        return res.json(result);
    }).catch((error)=>{
        console.log("Error "+error);
        return res.status(500).json({message: 'Error searching for books'});
    });
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
