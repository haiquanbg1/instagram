const jwt = require("jsonwebtoken")
const promisify = require('util').promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const generateToken = async (payload, type) => {
    if (type === "accessToken") {
        secretSignature = process.env.ACCESS_TOKEN_SECRET;
        tokenLife = process.env.ACCESS_TOKEN_LIFE;
    }

    if (type === "refreshToken") {
        secretSignature = process.env.REFRESH_TOKEN_SECRET;
        tokenLife = process.env.REFRESH_TOKEN_LIFE;
    }

    try {
        return await sign(
            {
                payload,
            },
            secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife,
            },
        );
    } catch (error) {
        console.log(`Error in generate access token:  + ${error}`);
        return null;
    }
};

const decodeToken = async (token, secretKey = process.env.REFRESH_TOKEN_SECRET) => {
    try {
        return await verify(token, secretKey, {
            ignoreExpiration: true,
        })
    } catch (error) {
        console.log(`Error in decode access token: ${error}`)
        return null
    }
}

const verifyToken = async (token, secretKey = process.env.ACCESS_TOKEN_SECRET) => {
    try {
        return await verify(token, secretKey);
    } catch (error) {
        console.log(`Error in verify access token:  + ${error}`);
        return null;
    }
};

module.exports = {
    generateToken,
    decodeToken,
    verifyToken
}