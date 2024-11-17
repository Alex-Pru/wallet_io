import express, { request, response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./auth/strategies/google-strategy.js";
import { sessionStore } from "./db/connection.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/UsersRoutes.js";
import walletRouter from "./routes/WalletsRoutes.js";
import transactionRouter from "./routes/TransactionsRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    store: sessionStore,
    cookie: {
      maxAge: 60000 * 10,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/api/status", (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.use("/api/google", authRouter);
app.use("/api/user", userRouter);
app.use("/api/wallets", walletRouter);
app.use("/api/transactions", transactionRouter);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

export default startServer;
