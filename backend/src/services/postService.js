const { Post } = require("../models/index");

const create = async (insertClause) => {
    return Post.create(insertClause);
}

module.exports = {
    create,
}