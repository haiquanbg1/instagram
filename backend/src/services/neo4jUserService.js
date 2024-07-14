const { int } = require('neo4j-driver');
const { driver } = require('../databases/neo4j');

const neo4jUserService = {
    getUserLikePost: async (postName, skip, limit) => {
        const session = driver.session();
        try {
            const result = await session.run(
                `MATCH (u:User)-[:LIKE]->(p:Post {name: $postName})
                RETURN u
                SKIP $skip
                LIMIT $limit`,
                { postName, skip: int(skip), limit: int(limit) }
            );
            return result.records.map(record => record.get('u').properties.name);
        } finally {
            await session.close();
        }
    },

    followUser: async (userFollow, userFollowed) => {
        const session = driver.session();
        
        try {
            const result = await session.run(
                'MATCH (u1:User {name: $userFollow}), (u2:User {name: $userFollowed}) CREATE (u1)-[:FOLLOW]->(u2)',
                { userFollow, userFollowed }
            );
            return result;
        } finally {
            await session.close();
        }
    },

    countUserFollowing: async (userName) => {
        const session = driver.session();
        try {
            const result = await session.run(
                'MATCH (:User {name: $userName})-[:FOLLOW]->(u:User) RETURN count(u) AS followsCount',
                { userName }
            );
            return result.records[0].get('followsCount').toString();
        } finally {
            await session.close();
        }
    },

    countUserFollow: async (userName) => {
        const session = driver.session();
        try {
            const result = await session.run(
                'MATCH (:User {name: $userName})<-[:FOLLOW]-(u:User) RETURN count(u) AS followsCount',
                { userName }
            );
            return result.records[0].get('followsCount').toString();
        } finally {
            await session.close();
        }
    },

    getUserFollow: async (userName, skip, limit) => {
        const session = driver.session();
        try {
            const result = await session.run(
                `MATCH (u:User)-[:FOLLOW]->(us:User {name: $userName})
                RETURN u
                SKIP $skip
                LIMIT $limit`,
                { userName, skip: int(skip), limit: int(limit) }
            );
            return result.records.map(record => record.get('u').properties.name);
        } finally {
            await session.close();
        }
    },

    getUserFollowing: async (userName, skip, limit) => {
        const session = driver.session();
        try {
            const result = await session.run(
                `MATCH (u:User)<-[:FOLLOW]-(us:User {name: $userName})
                RETURN u
                SKIP $skip
                LIMIT $limit`,
                { userName, skip: int(skip), limit: int(limit) }
            );
            return result.records.map(record => record.get('u').properties.name);
        } finally {
            await session.close();
        }
    }
}

module.exports = neo4jUserService;