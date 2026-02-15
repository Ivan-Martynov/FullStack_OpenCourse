const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");

blogsRouter.get("/", (_request, response) => {
    Blog.find({}).then((blogs) => response.json(blogs));
});

blogsRouter.post("/", (request, response) => {
    new Blog(request.body)
        .save()
        .then((savedBlog) => response.status(201).json(savedBlog));
});

module.exports = blogsRouter;

