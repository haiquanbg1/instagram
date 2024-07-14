const { driver } = require('../databases/neo4j');

const neo4jPostService = {
    userCreatePost: async (userName, postName) => {
        const session = driver.session();
        userName = userName.toString();
        
        try {
           const result = await session.run(
                'MATCH (u:User {name: $userName}), (p:Post {name: $postName}) CREATE (u)-[:CREATE]->(p)',
                { userName, postName }
            );
            return result;
        } finally {
            await session.close();
        }
    },
    
    userLikePost: async (userName, postName) => {
        const session = driver.session();
        userName = userName.toString();
        
        try {
            const result = await session.run(
                'MATCH (u:User {name: $userName}), (p:Post {name: $postName}) CREATE (u)-[:LIKE]->(p)',
                { userName, postName }
            );
            return result;
        } finally {
            await session.close();
        }
    },
    
    userUnlikePost: async (userName, postName) => {
        const session = driver.session();
        userName = userName.toString();
        
        try {
            const result = await session.run(
                'MATCH (u:User {name: $userName})-[r:LIKE]->(p:Post {name: $postName}) DELETE r',
                { userName, postName }
            );
            return result;
        } finally {
            await session.close();
        }
    },
    
    getLikesCount: async (postName) => {
        const session = driver.session();
        try {
            const result = await session.run(
                'MATCH (:Post {name: $postName})<-[:LIKE]-(u:User) RETURN count(u) AS likesCount',
                { postName }
            );
            return result.records[0].get('likesCount').toString();
        } finally {
            await session.close();
        }
    },
}

module.exports = neo4jPostService;