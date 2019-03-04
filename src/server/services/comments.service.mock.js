import BaseConsumer from '../consumer';
var CommentsService = Object.create(BaseConsumer);
CommentsService.name = "CommentsServiceMock";
CommentsService.commentMap = {};
CommentsService.count = 0;
CommentsService.getComment = async function(commentId) {
  if (this.commentMap[commentId]) {
    return this.commentMap[commentId];
  }
  return { error: 404 };
};
CommentsService.postComment = async function(postId, userId, body) {
  this.commentMap[this.count] = {
    id: this.count,
    parent: undefined,
    post: postId,
    user: userId,
    body: body,
    children: []
  };
  this.count += 1;
  return this.count - 1;
};
CommentsService.postReply = async function(commentId, userId, body) {
  var parentComment = await this.getComment(commentId);
  if (parentComment.error) {
    return { error: parentComment.error };
  }
  this.commentMap[this.count] = {
    id: this.count,
    parent: parentComment.id,
    post: parentComment.post,
    user: userId,
    body: body,
    children: []
  };
  this.commentMap[parentComment.id].children.push(this.count);
  this.count += 1;
  return this.count - 1;
};
export default CommentsService;