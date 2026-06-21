const { getDatabase } = require("../server/db");
const { methodNotAllowed, sendJson } = require("./_utils");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    methodNotAllowed(response, ["GET"]);
    return;
  }

  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();

    sendJson(response, 200, {
      ok: true,
      database: db.databaseName,
      collections: collections.map((collection) => collection.name),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      message: error.message,
      checkedAt: new Date().toISOString(),
    });
  }
};
