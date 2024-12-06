import express from "express";
import passport from "passport";
import redirectIfAuthenticated from "../middlewares/RedirectIfAuthenticated.js";

const router = express.Router();

router.get("/auth", redirectIfAuthenticated, passport.authenticate("google"));

router.get(
  "/redirect",
  passport.authenticate("google", {
    successRedirect: `${process.env.CORS_ORIGIN}:${process.env.FRONT_PORT}/home`,
    failureRedirect: `${process.env.CORS_ORIGIN}:${process.env.FRONT_PORT}/login?event=error`,
  })
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid"); // Limpa o cookie da sessão, se houver
    res.redirect("/api/status");
  });
});

export default router;
