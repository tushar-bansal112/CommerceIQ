# CommerceIQ

## Description
This project is a RESTful API server built with Express.js for managing posts and authors data. It uses JSON file for data storage.

## Endpoints

### Posts

- **GET /posts** : Get all posts.

- **GET /posts/:id** : Get a specific post by ID

- **POST /posts** : Create a new post
  - Request Body: 
      - `title`: Title of the post (required).
      - `author`: Name of the author (required).
      - `views`: Number of views (optional, default is 0), it gets updated when a specific post is retrieved.
      - `review_arr`: Array of reviews (optional, default is an empty array), it gets updated when a review is pushed.
      - `reviews`: Number of reviews (optional, default is 0).

- **PUT /posts/:id/review** : Add a review to a post
  - Request Body:
     - `review`: Property containing the review text.

- **DELETE /posts/:id** : Delete a post by ID

### Authors

- **GET /authors** : Get all authors
  
- **GET /authors/:id** : Get a specific author by ID

- **POST /authors** : Create a new author
  - Request Body: 
    - `first_name`: First name of the author (required).
    - `last_name`: Last name of the author (optional, default is an empty string).
    - `posts`: Number of posts by the author (optional, default is 0).

- **DELETE /authors/:id** : Delete an author by ID

