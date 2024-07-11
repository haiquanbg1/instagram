const { session } = require('../databases/neo4j');

const neo4jService = {
  createPerson: async (name) => {
    try {
      const result = await session.run(
        'CREATE (a:User {name: $name}) RETURN a',
        { name: name }
      );

      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      return node.properties;
    } finally {
      await session.close();
    }
  },

  findPerson: async (name) => {
    try {
      const result = await session.run(
        'MATCH (a:User {name: $name}) RETURN a',
        { name: name }
      );

      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      return node.properties;
    } finally {
      await session.close();
    }
  }
};

module.exports = neo4jService;