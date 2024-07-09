const { User } = require("../models/index");

const findAll = async (whereClause) => {
    return await User.findAll({
        where: whereClause
    });
}

const findOne = async (whereClause) => {
    return await User.findOne({
        where: whereClause
    });
}

const create = async (insertClause) => {
    return await User.create(insertClause);
}

const drop = async (id) => {
    return await User.delete({
        where: {
            id: id
        }
    });
}

const update = async (id, updateClause) => {
    return await User.update(
        updateClause, {
        where: {
            id: id
        }
    })
}

module.exports = {
    findAll,
    findOne,
    create,
    drop,
    update
}