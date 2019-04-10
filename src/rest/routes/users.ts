import * as Router from "koa-router";
import PostUsers from "./users.post";
import GetUsers from "./users.get";

const UsersRouter = new Router();

UsersRouter.post("/", PostUsers);
UsersRouter.get("/:id", GetUsers);

export default UsersRouter;
