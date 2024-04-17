import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import cors from 'cors'
import Book from './Models/Book.model.js';

dotenv.config()

const app = express();

const PORT = 5000;


app.use(express.json())

app.use(cors())




const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Retry connection after a delay
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
};

const connect = async () => {
    await connectWithRetry();
};

app.listen(PORT, ()=> {
    connect();
    console.log(`Server is running on port ${PORT}`);
});


app.get('/api/book/books', async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.get('/api/book/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book == null) {
        return res.status(404).json({ message: 'Book not found!' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/book/books', async (req, res) => {
   try {
    const Data = {
        ...req.body
       
      };
      const book = await Book.create(Data);
      res.status(201).json(book);
   } catch (error) {
    res.status(500).json(error);
   }
  });
  
app.put('/api/book/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found!' });
    }

  try {
    
    const updatedBook = await book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
  );
  res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/book/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }
    await book.remove();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/book/genre/:genre', async (req, res) => {
    try {
      const books = await Book.find({ genre: req.params.genre });
      if (books.length === 0) {
        return res.status(404).json({ message: 'Aucun livre trouvé pour ce genre' });
      }
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/book/books/:id/auteur', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (book == null) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.json({ author: book.author });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  