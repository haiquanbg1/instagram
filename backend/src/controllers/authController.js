const bcrypt = require("bcryptjs");

const User = require("../services/userService");
const { successResponse, errorResponse } = require("../utils/response");
const jwt = require("../utils/jwt");

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

        return successResponse(res, 201, "Register successfully!", {
            name: user.firstName + " " + user.lastName,
            userName: user.userName,
            role: user.role
        });
    } catch (error) {
        return errorResponse(res, 503, "Can't create user!");
    }
}

const login = async (req, res) => {
    let { account, password } = req.body;

    account = account.toLowerCase();

    const checkUserName = await User.findOne({
        userName: account
    });
    const checkEmail = await User.findOne({
        email: account
    });

    if (!checkEmail && !checkUserName) {
        return errorResponse(res, 404, "Account or password is wrong");
    }

    const user = checkEmail || checkUserName;

    if (!bcrypt.compareSync(password, user.password)) {
        return errorResponse(res, 404, "Account or password is wrong");
    }

    const accessToken = await jwt.generateToken({
        user_id: user.id
    },
        "accessToken"
    );
    let refreshToken = await jwt.generateToken(
        Math.floor(Math.random() * 1000),
        "refreshToken"
    );

    if (!user.refreshToken) {
        try {
            await User.update(user.id, {
                refreshToken: refreshToken
            });
        } catch (error) {
            return errorResponse(res, 503, "Can't login!");
        }
    } else {
        refreshToken = user.refreshToken;
    }

    return successResponse(res, 200, "Login successfully!", {
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: user.firstName + " " + user.lastName,
        userName: user.userName,
        role: user.role
    })
}

const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return errorResponse(res, 404, "Token not found!");
    }

    const decoded = await jwt.decodeToken(refreshToken);

    if (!decoded) {
        return errorResponse(res, 400, "Token invalid!");
    }

    let user;

    try {
        user = User.findOne({
            refreshToken: refreshToken
        });
    } catch (error) {
        return errorResponse(res, 500, "Can't find user");
    }

    if (!user) {
        return errorResponse(res, 404, "User not found!");
    }

    const accessToken = await jwt.generateToken(user.id, "accessToken");

    return successResponse(res, 200, "Refresh token successfully!", {
        accessToken
    });
}

module.exports = {
    register,
    login,
    refreshToken
}