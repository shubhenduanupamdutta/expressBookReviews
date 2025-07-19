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

// PUT: Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	/*
	Hint: The code must validate and sign in a customer based on the username and password created in Exercise 6. It must also save the user credentials for the session as a JWT.
As you are required to login as a customer, while testing the output on Postman, use the endpoint as "customer/login"
*/
	const isbn = req.params.isbn;
	const { review } = req.body;
	const username = req.user.data;

	if (!books[isbn]) {
		return res.status(404).json({ message: "Book not found" });
	}

	if (!books[isbn].reviews) {
		books[isbn].reviews = {
			[username]: review,
		};
	}

	books[isbn].reviews[username] = review;

	return res.status(200).json({
		message: "Review added successfully",
		review: books[isbn].reviews[username],
	});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
