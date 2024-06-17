const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 if(users.includes(username)){
  return true;
 }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if(users[username] === password){
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {  
  const {username, password} = req.body;
  if(authenticatedUser(username,password)){
    const token = jwt.sign({
      username
    }, "secret", { expiresIn: "1h" });
    return res.status(200).json({token: token});
  }

  return res.status(401).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "secret");
  const username = decoded.username;

  if(isValid(username)){
    if (!Array.isArray(books[isbn].reviews)) {
      books[isbn].reviews = [];
    }
    books[isbn].reviews.push(review);
    return res.status(200).json({message: "Review added successfully"});
  }
  return res.status(401).json({message: "Invalid credentials"});
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "secret");
  const username = decoded.username;

  if(isValid(username)){
    if (!Array.isArray(books[isbn].reviews)) {
      return res.status(404).json({message: "Review not found"});
    }
    if(books[isbn].reviews.includes(review)){
      books[isbn].reviews.splice(books[isbn].reviews.indexOf(review),1);
      return res.status(200).json({message: "Review deleted successfully"});
    }
    return res.status(404).json({message: "Review not found"});
  }
  return res.status(401).json({message: "Invalid credentials"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
