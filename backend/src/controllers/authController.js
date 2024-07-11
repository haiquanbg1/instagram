const bcrypt = require("bcryptjs");
const otp = require("otp-generator");

const User = require("../services/userService");
const Email = require("../services/emailService");
const { successResponse, errorResponse } = require("../utils/response");
const jwt = require("../utils/jwt");
const redis = require("../databases/redis");

const checkExists = async (req, res) => {
    const { email, userName } = req.body;

    // check email
    const checkEmailExists = await User.findOne({
        email: email
    });

    if (checkEmailExists) {
        return errorResponse(res, 400, "Email was exists!");
    };

    // check user
    const checkUserName = await User.findOne({
        userName: userName
    });

    if (checkUserName) {
        return errorResponse(res, 400, "User name was exists!");
    }

    return successResponse(res, 200, "All accepted!");
}

const register = async (req, res) => {
    let user = req.body;
    const { password } = user;

    // hash password
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

const verifyKey = async (req, res) => {
    const { email, key } = req.query;
    
    try {
        const expectedKey = await redis.get(email);

        if (expectedKey == key) {
            return successResponse(res, 200, "Email verified successfully!");
        }
        
        return errorResponse(res, 404, "Invalid key!");
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Can't verify key.");
    }
}

const verifyEmail = async (req, res) => {
    const { email } = req.body;

    const key = otp.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false
    });

    try {
        await Email.sendVerificationEmail(email, key);

        try {
            await redis.set(email, key);
            await redis.expire(email, 60);
        } catch (error) {
            return errorResponse(res, 500, "Can't store key!");
        }

        return successResponse(res, 200, "Registration successful. Please check your email to verify your account.");
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Error sending verification email.");
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    verifyKey,
    verifyEmail,
    checkExists
}