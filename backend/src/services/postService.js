const { Post } = require("../models/index");
const { getLikesCount } = require("./neo4jPostService");
const redis = require("../databases/redis");
const { like } = require("../controllers/postController");

const findAll = async (limit, offset) => {
    return await Post.findAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });
}

const create = async (insertClause) => {
    return await Post.create(insertClause);
}

const update = async (id, updateClause) => {
    return await Post.update(updateClause, {
        where: {
            id: id
        }
    })
}

const remove = async (id) => {
    return await Post.destroy({
        where: {
            id
        }
    });
}

const countLike = async (postId) => {
    const likeOfPost = `post:${postId}:likes`;

    const likes = await redis.get(likeOfPost);

    if (likes) {
        return likes;
    }

    const likesCount = await getLikesCount("post" + postId);
    await redis.set(likeOfPost, likesCount);
    await redis.expire(likeOfPost, 24 * 60 * 60);

    return likesCount;
}

module.exports = {
    create,
    update,
    findAll,
    countLike,
    remove
}