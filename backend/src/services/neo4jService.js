const { int } = require('neo4j-driver');
const { driver } = require('../databases/neo4j');

const neo4jService = {
  create: async (type, name) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `CREATE (a:${type} {name: $name}) RETURN a`,
        { name: name }
      );

      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      return node.properties;
    } finally {
      await session.close();
    }
  },

  find: async (type, name) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (a:${type} {name: $name}) RETURN a`,
        { name: name }
      );

      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      return node.properties;
    } finally {
      await session.close();
    }
  },

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
  }
};

module.exports = neo4jService;