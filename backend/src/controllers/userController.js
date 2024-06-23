const User = require("../services/userService");

const findAll = async (req, res) => {
    const { firstName, lastName, gender, privacy, birthday } = req.query;
    let whereClause = {};

    if (firstName) {
        whereClause.firstName = firstName;
    }

    if (lastName) {
        whereClause.lastName = lastName;
    }

    if (gender) {
        whereClause.gender = gender;
    }

    if (privacy) {
        whereClause.privacy = privacy;
    }

    if (birthday) {
        whereClause.birthday = birthday;
    }

    const users = await User.findAll(whereClause);

    return res.json(users);
}

const findOne = async (req, res) => {
    const {refreshToken, userName, email} = req.body;
    const whereClause = {};

    if (refreshToken) {
        whereClause.refreshToken = refreshToken;
    }

    if (userName) {
        whereClause.userName = userName;
    }

    if (email) {
        whereClause.email = email;
    }

    const user = await User.findOne(whereClause);

    return res.json(user);
}

module.exports = {
    findAll,
    findOne
}