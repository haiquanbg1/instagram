const { User } = require("../models/index");
const {kafkaProducer, kafkaConsumer } = require("../databases/kafka");
const neo4j = require("../databases/neo4j");

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