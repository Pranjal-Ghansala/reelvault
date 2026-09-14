import crypto from "node:crypto";

import { query } from "../config/database.js";

const COOKIE_NAME = "reelvault_user";

export async function anonymousUser(req, res, next) {
  try {
    let userId = req.signedCookies?.[COOKIE_NAME];

    if (!userId) {
      userId = crypto.randomUUID();

      await query(
        `
          INSERT INTO users (id)
          VALUES ($1)
        `,
        [userId]
      );

      res.cookie(COOKIE_NAME, userId, {
        httpOnly: true,
        signed: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
    }

    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
}