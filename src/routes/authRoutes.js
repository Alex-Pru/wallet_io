import express from "express";
import passport from "passport";
import redirectIfAuthenticated from "../middlewares/RedirectIfAuthenticated.js";

const router = express.Router();

router.get("/auth", redirectIfAuthenticated, passport.authenticate("google"));

router.get(
  "/redirect",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect: "http://localhost:3000/login?event=error",
  })
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid"); // Limpa o cookie da sessão, se houver
    res.redirect("/api/status");
  });
});

export default router;
