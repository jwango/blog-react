var express = require('express');
var router = express.Router();
import { MOCK_BLOG_POSTS } from '../mock/data';

/* GET post. */
router.get('/:postId', function(req, res, next) {
    let postId = req.params.postId;
    if (postId) {
        if (MOCK_BLOG_POSTS[postId]) {
            res.send(MOCK_BLOG_POSTS[postId]);
        } else {
            res.statusCode = 404;
            res.send('Could not find the post');
        }
    } else {
        res.statusCode = 400;
        res.send('Bad post id');
    }
});

module.exports = router;
