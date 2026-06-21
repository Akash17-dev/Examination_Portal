function sendJson(response, statusCode, payload) {
  response.setHeader("Content-Type", "application/json");
  response.status(statusCode).json(payload);
}

async function readBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    return JSON.parse(request.body || "{}");
  }

  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

function methodNotAllowed(response, allowed = ["GET"]) {
  response.setHeader("Allow", allowed.join(", "));
  sendJson(response, 405, { ok: false, message: "Method not allowed." });
}

module.exports = {
  methodNotAllowed,
  readBody,
  sendJson,
};
