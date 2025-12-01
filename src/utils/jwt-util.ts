// JWT utility - simplified for now
export const jwtUtil = {
  sign: (payload: object, expiresIn: string = "24h"): string => {
    // TODO: Implement JWT signing when needed
    return JSON.stringify(payload);
  },

  verify: (token: string): any => {
    // TODO: Implement JWT verification when needed
    return JSON.parse(token);
  }
};