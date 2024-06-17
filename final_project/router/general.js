const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // registration of new user
  const {username, password} = req.body;
  if(isValid(username)){
    return res.status(400).json({message: "User already exists"});
  }
  users.push(username);
  users[username] = password;
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) { 
  const book_list = [];
  for (let book in books){
    book_list.push(books[book]);
  }
  return res.status(200).json({book_list});
});

// Get the book list available in the shop using callback
public_users.get('callback/',function (req, res) { 
  const book_list = [];
  books.forEach(book => {
    book_list.push(book);
  });
  return res.status(200).json({book_list});
});

// Get the book list available in the shop using promise
public_users.get('promise/',function (req, res) { 
  const book_list = book_list = new Promise((resolve, reject) => {
    resolve(books);
  });
  return res.status(200).json({book_list});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  if(books[isbn]){
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;
  const book_list = [];
  for (let book in books){
    if(books[book].author === author){
      book_list.push(books[book]);
    }
  }
  if(book_list.length > 0){
    return res.status(200).json({book_list});
  }
  return res.status(404).json({message: "Author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  const book_list = [];
  for (let book in books){
    if(books[book].title === title){
      book_list.push(books[book]);
    }
  }
  if(book_list.length > 0){
    return res.status(200).json({book_list});
  }
  return res.status(404).json({message: "Title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  if(books[isbn]){
    return res.status(200).json({reviews: books[isbn].reviews});
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
