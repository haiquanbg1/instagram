var neo4j = require('neo4j-driver');

let driver, session;

(async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = process.env.neo4j_url;
  const USER = process.env.neo4j_user;
  const PASSWORD = process.env.neo4j_password;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    session = driver.session();
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
})();

module.exports = {
  driver,
  session
};