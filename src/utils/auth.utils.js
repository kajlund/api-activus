import jwt from "jsonwebtoken";

export function getAuthUtils(cnf, log) {
  return {
    verifyAccessToken: (token) => {
      try {
        const decoded = jwt.verify(token, cnf.accessTokenSecret, { clockTolerance: 30 });
        return decoded;
      } catch (err) {
        log.error(err);
        return null;
      }
    },
  };
}
