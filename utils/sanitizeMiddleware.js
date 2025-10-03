const xss = require("xss");

// Custom whitelist for editor content
const editorOptions = {
  whiteList: {
    p: ["style"],
    h1: ["style"],
    h2: ["style"],
    h3: ["style"],
    b: [],
    i: [],
    strong: [],
    em: [],
    u: [],
    a: ["href", "title", "target"],
    ul: [],
    ol: [],
    li: [],
    blockquote: [],
    code: [],
    pre: [],
    span: ["style"],
  },
  stripIgnoreTag: true, // remove non-whitelisted tags
  stripIgnoreTagBody: ["script"], // drop <script> body
};

const customXss = new xss.FilterXSS(editorOptions);

// Recursive sanitizer → will also clean nested objects/arrays
function sanitize(obj) {
  if (typeof obj === "string") {
    return xss(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj !== null && typeof obj === "object") {
    for (const key in obj) {
      obj[key] = sanitize(obj[key]);
    }
  }
  return obj;
}

exports.sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
};

exports.sanitizeQuery = (req, res, next) => {
  if (req.query) {
    req.query = sanitize(req.query);
  }
  next();
};

exports.sanitizeParams = (req, res, next) => {
  if (req.params) {
    req.params = sanitize(req.params);
  }
  next();
};
