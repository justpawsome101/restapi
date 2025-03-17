const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


let books = [];


app.get("/whoami", (req, res) => {
  res.json({ studentNumber: "2555497" });
});


app.get("/books", (req, res) => {
  res.json(books);
});


app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});


app.post("/books", (req, res) => {
  const { id, title, details } = req.body;
  if (!id || !title || !details) {
    return res.status(400).json({ error: "Missing book details" });
  }
  if (books.some((b) => b.id === id)) {
    return res.status(400).json({ error: "Book  already exists" });
  }
  books.push({ id, title, details });
  res.status(201).json({ message: "Book added " });
});


app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  const { title, details } = req.body;
  if (title) book.title = title;
  if (details) book.details = details;
  res.json({ message: "Book updated successfully" });
});


app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });
  books.splice(index, 1);
  res.json({ message: "Book deleted" });
});


app.post("/books/:id/details", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  const { id, author, genre, publicationYear } = req.body;
  if (!id || !author || !genre || !publicationYear) {
    return res.status(400).json({ error: "Missing detail fields" });
  }
  book.details.push({ id, author, genre, publicationYear });
  res.status(201).json({ message: "yay" });
});


app.delete("/books/:id/details/:detailId", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  const detailIndex = book.details.findIndex((d) => d.id === req.params.detailId);
  if (detailIndex === -1) return res.status(404).json({ error: "Detail not found" });
  book.details.splice(detailIndex, 1);
  res.json({ message: "Detail removed successfully" });
});

