var neo4j = require('neo4j-driver');

let driver;

(async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = "neo4j+s://a0df04ea.databases.neo4j.io";
  const USER = "neo4j";
  const PASSWORD = "aLgaUdBKYcteDSbF825wbPpnRJnzh9MTzdXddmugYmU";

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
})();

module.exports = driver;