const bcrypt = require("bcryptjs");

const User = require("../services/userService");
const { successResponse, errorResponse } = require("../utils/response");

const register = async (req, res) => {
    let user = req.body;
    const { email, password, userName } = user;

    const checkEmail = await User.findOne({
        email: email
    });

    if (checkEmail) {
        return errorResponse(res, 400, "Email was exists!");
    };

    const checkUserName = await User.findOne({
        userName: userName
    });

    if (checkUserName) {
        return errorResponse(res, 400, "User name was exists!");
    }

    user.password = bcrypt.hashSync(password, 10);

    try {
        await User.create(user);

        return successResponse(res, 201, "Create user successfully!", {
            name: user.firstName + " " + user.lastName,
            userName: user.userName,
            role: user.role
        });
    } catch (error) {
        return errorResponse(res, 503, "Can't create user!");
    }
}

module.exports = {
    register,
}