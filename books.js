const express = require('express');
const router = express.Router();

// Mock data for demonstration
const books = [
    { id: 1, title: 'The alchemist', author: 'Author A', ISBN: '1234567890', reviews: ['No review'] },
    { id: 2, title: 'The day I taught My grandmother to read', author: 'Sudha Murthy', ISBN: '0987654321', reviews: ['No review'] }
];

// Middleware to mock user authentication
const mockAuthMiddleware = (req, res, next) => {
    const { username } = req.body;
    if (!username) {
        return res.status(401).send('Unauthorized');
    }
    req.user = { username }; // Mock user object
    next();
};

// Get all books
router.get('/books', (req, res) => {
    res.json(books);
});

// Get book by ISBN
router.get('/books/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.ISBN === isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// Get books by author
router.get('/books/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).send('No books found by this author');
    }
});

// Get books by title
router.get('/books/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = books.filter(b => b.title.toLowerCase() === title.toLowerCase());
    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).send('No books found with this title');
    }
});

// Get book reviews
router.get('/books/:isbn/reviews', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.ISBN === isbn);
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).send('Book not found');
    }
});

// Add/Modify book review
router.post('/books/:isbn/reviews', mockAuthMiddleware, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const book = books.find(b => b.ISBN === isbn);

    if (!book) {
        return res.status(404).send('Book not found');
    }

    const existingReview = book.reviews.find(r => r.username === req.user.username);

    if (existingReview) {
        existingReview.review = review;
        res.json({ message: 'Review updated', reviews: book.reviews });
    } else {
        book.reviews.push({ username: req.user.username, review });
        res.status(201).json({ message: 'Review added', reviews: book.reviews });
    }
});

// Delete book review
router.delete('/books/:isbn/reviews', mockAuthMiddleware, (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.ISBN === isbn);

    if (!book) {
        return res.status(404).send('Book not found');
    }

    const reviewIndex = book.reviews.findIndex(r => r.username === req.user.username);

    if (reviewIndex === -1) {
        return res.status(404).send('Review not found');
    }

    book.reviews.splice(reviewIndex, 1);
    res.json({ message: 'Review deleted', reviews: book.reviews });
});

module.exports = router;
