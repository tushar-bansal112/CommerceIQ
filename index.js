const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');



const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let store = {};

try {
  const data = fs.readFileSync('store.json', 'utf8');
  store = JSON.parse(data);
} catch (err) {
  console.error(err);
}


// Function to save the data to the file

function saveStore() {
  fs.writeFileSync('store.json', JSON.stringify(store, null, 2));
}

// GET endpoint to retrieve all posts

app.get('/posts', (req, res) => {
  res.json(store.posts || []);
});

// GET endpoint to retrieve a specific post by ID

app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = store.posts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  post.views++; // Increment the views count
  saveStore(); // Save the updated data to the file
  res.json(post);
});

// POST endpoint to create a new post

app.post('/posts', (req, res) => {
  const newPost = req.body;
  newPost.id = store.posts ? store.posts.length : 0;

  if(!newPost.title || !newPost.author) {
    return res.status(400).json({ message: 'Title and author name is required' });
  } 
  newPost.views = newPost.views || 0;
  newPost.review_arr = newPost.review_arr || [];
  newPost.reviews = newPost.reviews || 0;
  store.posts = [...(store.posts || []), newPost];

  // Check if the author of the new post already exists in the authors array

  const existingAuthor = store.authors.find((a) => a.first_name === newPost.author);
  if (existingAuthor) {
    existingAuthor.posts++;
  } else {
    const newAuthor = {
      id: store.authors ? store.authors.length : 0,
      first_name: newPost.author,
      last_name: "",
      posts: 1
    };
    store.authors = [...(store.authors || []), newAuthor];
  }
  
  saveStore();
  res.status(201).json(newPost);
});

// PUT endpoint to add a review to a post

app.put('/posts/:id/review', (req, res) => {
    const postId = parseInt(req.params.id);
    const review = req.body.review;
  
    const post = store.posts.find((p) => p.id === postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if(!post.review_arr){
        post.review_arr = []
    }
  
    post.review_arr.push(review);
    post.reviews++; // Increment the reviews count
    saveStore();
    res.json({ message: 'Review added successfully' });
});

// DELETE endpoint to delete a post by ID

app.delete('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = store.posts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  store.posts = (store.posts || []).filter((p) => p.id !== postId);
  const author = store.authors.find((a) => a.first_name === post.author);
  author.posts--;
  
  saveStore();
  res.json({ message: 'Post deleted' });
});

// other endpoints for authors

// GET endpoint to retrieve all authors
app.get('/authors', (req, res) => {
  res.json(store.authors || []);
});

// GET endpoint to retrieve a specific author by ID

app.get('/authors/:id', (req, res) => {
  const authorId = parseInt(req.params.id);
  const author = store.authors.find((a) => a.id === authorId);
  if (!author) {
    return res.status(404).json({ message: 'Author not found' });
  }
  res.json(author);
});


// POST endpoint to create a new author

app.post('/authors', (req, res) => {
  const newAuthor = req.body;
  newAuthor.id = store.authors ? store.authors.length : 0;
  if(!newAuthor.first_name) {
    return res.status(400).json({ message: 'Firstname is required' });
  } 
  newAuthor.last_name = newAuthor.last_name || "";
  newAuthor.posts = newAuthor.posts ||  0;
  store.authors = [...(store.authors || []), newAuthor];
  saveStore();
  res.status(201).json(newAuthor);
});

// DELETE endpoint to delete a author by ID

app.delete('/authors/:id', (req, res) => {
  const authorId = parseInt(req.params.id);
  const author = store.authors.find((a) => a.id === authorId);
  if (!author) {
    return res.status(404).json({ message: 'Author not found' });
  }
  store.authors = (store.authors || []).filter((a) => a.id !== authorId);
  saveStore();
  res.json({ message: 'Author deleted' });
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
