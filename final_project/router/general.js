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

public_users.get("/", function (req, res) {
	const get_books = new Promise((resolve, reject) => {
		resolve(res.send(JSON.stringify(books, null, 4)));
	});
	get_books
		.then(() => console.log("Books data fetched successfully"))
		.catch((error) => console.error("Error fetching books data:", error));
});

public_users.get("/isbn/:isbn", function (req, res) {
	const books_by_isbn_promise = new Promise((resolve, reject) => {
		const isbn = req.params.isbn;
		console.log("Fetching book with ISBN:", isbn);
		if (books[isbn]) {
			resolve(res.status(200).json(books[isbn]));
		} else {
			reject(res.status(404).json({ message: "Book not found" }));
		}
	});
	return books_by_isbn_promise
		.then(() => console.log("Book found successfully"))
		.catch((error) => console.error("Error fetching book:", error));
});

public_users.get("/author/:author", async function (req, res) {
	const books_by_author_promise = new Promise((resolve, reject) => {
		const author = req.params.author;
		console.log("Fetching books by author:", author);
		let foundBooks = Object.values(books).filter(
			(book) => book.author.toLowerCase() === author.toLowerCase()
		);
		if (foundBooks.length > 0) {
			resolve(res.status(200).json(foundBooks));
		} else {
			reject(res.status(404).json({ message: "No books found by this author" }));
		}
	});

	return books_by_author_promise
		.then(() => console.log("Books by author found successfully"))
		.catch((error) => console.error("Error fetching books by author:", error));
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
