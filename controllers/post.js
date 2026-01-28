const BlogPost = require('../models/BlogPost');

// Create Blog Post
module.exports.createPost = (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send({ message: 'Title and content are required' });
    }

    let newPost = new BlogPost({
        title,
        content,
        author: req.user.id
    });

    return newPost.save()
        .then(result => res.status(201).send(result))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in creating post', error: err });
        });
};

// Get All Blog Posts
module.exports.getAllPosts = (req, res) => {
    return BlogPost.find({})
        .populate('author', 'username email')
        .then(posts => res.status(200).send(posts))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in retrieving posts', error: err });
        });
};

// Get Single Blog Post
module.exports.getSinglePost = (req, res) => {
    return BlogPost.findById(req.params.id)
        .populate('author', 'username email')
        .then(post => {
            if (!post) {
                return res.status(404).send({ message: 'Post not found' });
            }
            res.status(200).send(post);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in retrieving post', error: err });
        });
};

// Update Blog Post (Author Only)
module.exports.updatePost = (req, res) => {
    const { title, content } = req.body;

    BlogPost.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ message: 'Post not found' });
            }

            // Authorization Check
            if (post.author.toString() !== req.user.id) {
                return res.status(403).send({ message: 'Action Forbidden. You are not the author.' });
            }

            post.title = title || post.title;
            post.content = content || post.content;

            return post.save();
        })
        .then(updatedPost => res.status(200).send(updatedPost))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in updating post', error: err });
        });
};

// Delete Blog Post (Author or Admin)
module.exports.deletePost = (req, res) => {
    BlogPost.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ message: 'Post not found' });
            }

            // Authorization Check: Author or Admin
            if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
                return res.status(403).send({ message: 'Action Forbidden' });
            }

            return BlogPost.findByIdAndDelete(req.params.id);
        })
        .then(() => res.status(200).send({ message: 'Post deleted successfully' }))
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error in deleting post', error: err });
        });
};
