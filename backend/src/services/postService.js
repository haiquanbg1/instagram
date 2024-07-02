const { Post } = require("../models/index");

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

module.exports = {
    create,
    update,
}