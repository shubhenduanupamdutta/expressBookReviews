const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ message: "Username and password are required" });
	}
	if (isValid(username)) {
		return res.status(400).json({ message: "Username already exists. Please login." });
	}
	users.push({ username, password });
	return res.status(201).json({ message: `User ${username} registered successfully.` });
});

// GET: Get the book list available in the shop
public_users.get("/", function (req, res) {
	res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	if (books[isbn]) {
		return res.status(200).json(books[isbn]);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author;
	let foundBooks = Object.values(books).filter(
		(book) => book.author.toLowerCase() === author.toLowerCase()
	);
	if (foundBooks.length > 0) {
		return res.status(200).json(foundBooks);
	} else {
		return res.status(404).json({ message: "No books found by this author" });
	}
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title;
	let foundBooks = Object.values(books).filter(
		(book) => book.title.toLowerCase() === title.toLowerCase()
	);
	if (foundBooks.length > 0) {
		return res.status(200).json(foundBooks);
	} else {
		return res.status(404).json({ message: "No books found with this title" });
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	if (books[isbn] && books[isbn].reviews) {
		return res.status(200).json(books[isbn].reviews);
	} else {
		return res.status(404).json({ message: "No reviews found for this book" });
	}
});

/*
Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios.
*/

let booksPromise = new Promise((resolve, reject) => {
	resolve(books);
});
booksPromise.then((data) => {
	console.log("Books data fetched successfully");
	console.log(data);
});

function books_by_isbn_promise(isbn) {
	return new Promise((resolve, reject) => {
		if (books[isbn]) {
			resolve(books[isbn]);
		} else {
			reject("Book not found");
		}
	});
}
books_by_isbn_promise("1")
	.then((book) => {
		console.log("Book found:", book);
	})
	.catch((error) => {
		console.error(error);
	});

function books_by_author_promise(author) {
	return new Promise((resolve, reject) => {
		let foundBooks = Object.values(books).filter(
			(book) => book.author.toLowerCase() === author.toLowerCase()
		);
		if (foundBooks.length > 0) {
			resolve(foundBooks);
		} else {
			reject("No books found by this author");
		}
	});
}

books_by_author_promise("Jane Austen")
	.then((books) => {
		console.log("Books by author found:", books);
	})
	.catch((error) => {
		console.error(error);
	});

function books_by_title_promise(title) {
	return new Promise((resolve, reject) => {
		let foundBooks = Object.values(books).filter(
			(book) => book.title.toLowerCase() === title.toLowerCase()
		);
		if (foundBooks.length > 0) {
			resolve(foundBooks);
		} else {
			reject("No books found with this title");
		}
	});
}

books_by_title_promise("One Thousand and One Nights")
	.then((books) => {
		console.log("Books with title found:", books);
	})
	.catch((error) => {
		console.error(error);
	});

module.exports.general = public_users;
