const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;

let books = [];

const validateBookDetails = (details) => {
  return details.every(
    (detail) =>
      detail.id && detail.author && detail.genre && detail.publicationYear
  );
};

app.get("/whoami", (request, response) => {
  const student = {
    studentNumber: "2555497",
  };
  response.send(student);
});

app.get("/books", (request, response) => {
  response.send(books);
});

app.get("/books/:id", (request, response) => {
  const book = books.find((b) => b.id === request.params.id);
  if (!book) {
    response.status(404).send({ error: "Book notfound" });
  } else {
    response.send(book);
  }
});

app.post("/books", (request, response) => {
  const { id, title, details } = request.body;
  if (!id || !title || !details || !validateBookDetails(details)) {
    response.status(400).send({ error: "Missing details" });
  } else if (books.some((b) => b.id === id)) {
    response.status(400).send({ error: "Book already exists" });
  } else {
    books.push({ id, title, details });
    response.status(201).send({ message: "Book added successfully :)" });
  }
});

app.put("/books/:id", (request, response) => {
  const book = books.find((b) => b.id === request.params.id);
  if (!book) {
    response.status(404).send({ error: "Book not found" });
  } else {
    const { title, details } = request.body;
    if (title) book.title = title;
    if (details) {
      if (!validateBookDetails(details)) {
        response.status(400).send({ error: "Invalid details" });
      } else {
        book.details = details;
      }
    }
    response.send({ message: "Book updated successfully :))" });
  }
});

app.delete("/books/:id", (request, response) => {
  const index = books.findIndex((b) => b.id === request.params.id);
  if (index === -1) {
    response.status(404).send({ error: "Book not found" });
  } else {
    books.splice(index, 1);
    response.send({ message: "Book deleted successfully :(" });
  }
});

app.post("/books/:id/details", (request, response) => {
  const book = books.find((b) => b.id === request.params.id);
  if (!book) {
    response.status(404).send({ error: "Book not found" });
  } else {
    const { id, author, genre, publicationYear } = request.body;
    if (!id || !author || !genre || !publicationYear) {
      response.status(400).send({ error: "Missing required book details" });
    } else {
      book.details.push({ id, author, genre, publicationYear });
      response.status(201).send({ message: "Book details added successfully" });
    }
  }
});

app.delete("/books/:id/details/:detailId", (request, response) => {
  const book = books.find((b) => b.id === request.params.id);
  if (!book) {
    response.status(404).send({ error: "Book not found" });
  } else {
    const detailIndex = book.details.findIndex((d) => d.id === request.params.detailId);
    if (detailIndex === -1) {
      response.status(404).send({ error: "Details not found" });
    } else {
      book.details.splice(detailIndex, 1);
      response.send({ message: "Removed successfully" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
