const neo4jUserService = require("../services/neo4jUserService");
const User = require("../services/userService");
const { errorResponse, successResponse } = require("../utils/response");

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

const followUser = async (req, res) => {
    const userFollow = req.user.userName;
    const userFollowed = req.body.userName;

    await neo4jUserService.followUser(userFollow, userFollowed)
    .catch((err) => {
        console.log(err);
        return errorResponse(res, 500, "Can't follow user!");
    })

    return successResponse(res, 200, "Follow user successfully!");
}

const getUserFollow = async (req, res) => {
    const { userName, page } = req.user;
    const limit = 20;
    const skip = page * limit;

    const users = await neo4jUserService.getUserFollow(userName, skip, limit)
    .catch((err) => {
        console.log(err);
        return errorResponse(res, 500, "Can't get user follow!");
    })

    return successResponse(res, 200, "Find user follow successfully!", users);
}

const getUserFollowing = async (req, res) => {
    const { userName, page } = req.user;
    const limit = 20;
    const skip = page * limit;

    const users = await neo4jUserService.getUserFollowing(userName, skip, limit)
    .catch((err) => {
        console.log(err);
        return errorResponse(res, 500, "Can't get user follow!");
    })

    return successResponse(res, 200, "Find user follow successfully!", users);
}

module.exports = {
    findAll,
    findOne,
    followUser,
    getUserFollow,
    getUserFollowing
}