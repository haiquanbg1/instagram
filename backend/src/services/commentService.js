const { Comment } = require("../models/index");

const findAllByPost = async (post_id) => {
    return await Comment.findAll({
        where: {
            post_id: post_id
        }
    });
}

const createByPost = async (insertClause) => {
    return await Comment.create(insertClause);
}

const update = async (id, updateClause) => {
    return await Comment.update(
        updateClause,
        {
            where: {
                id: id
            }
        }
    )
}

const drop = async (comment_id) => {
    return await Comment.destroy({
        where: {
            id: comment_id
        }
    });
}

module.exports = {
    findAllByPost,
    createByPost,
    drop,
    update
}