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
};

module.exports = neo4jService;