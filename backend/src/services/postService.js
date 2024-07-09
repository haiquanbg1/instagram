const { Op } = require("sequelize");
const { Post } = require("../models/index");

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

module.exports = {
    create,
    update,
    findAll,
}