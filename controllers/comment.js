const Comment = require('../models/Comment');

// Add Comment
module.exports.addComment = (req, res) => {
    const { content, blogPostId } = req.body;

    if (!content || !blogPostId) {
        return res.status(400).send({ message: 'Content and blog post ID are required' });
    }

    let newComment = new Comment({
        content,
        blogPost: blogPostId,
        author: req.user.id
    });

    return newComment.save()
        .then(comment => res.status(201).send(comment))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in adding comment', error: err });
        });
};

// Get Comments for a Blog Post
module.exports.getCommentsForPost = (req, res) => {
    return Comment.find({ blogPost: req.params.postId })
        .populate('author', 'username')
        .then(comments => res.status(200).send(comments))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in retrieving comments', error: err });
        });
};

// Remove Comment (Admin Only)
module.exports.removeComment = (req, res) => {
    return Comment.findByIdAndDelete(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).send({ message: 'Comment not found' });
            }
            res.status(200).send({ message: 'Comment removed successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in removing comment', error: err });
        });
};
