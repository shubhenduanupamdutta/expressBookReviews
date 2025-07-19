const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	//returns boolean
	return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	return users.some((user) => user.username === username && user.password === password);
};

//POST: only registered users can login
regd_users.post("/login", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Error logging in. Username and password are required" });
	}
	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({ data: username }, process.env.SECRET_TOKEN, {
			expiresIn: 60 * 60,
		});
		req.session.authorization = { accessToken, username };
		return res.status(200).json({ message: "User successfully logged in", accessToken });
	} else {
		return res.status(401).json({ message: "Invalid login. Check username and password." });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
