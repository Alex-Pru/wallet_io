import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/auth", passport.authenticate("google"));

router.get(
  "/redirect",
  passport.authenticate("google", {
    successRedirect: "https://youtube.com",
  })
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid"); // Limpa o cookie da sessão, se houver
    res.redirect("/api/status");
  });
});

export default router;
