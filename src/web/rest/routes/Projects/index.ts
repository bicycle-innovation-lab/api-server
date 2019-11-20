import * as Router from "koa-router";
import PostProjects from "./projects.post";
import {GetMultipleProjects, GetOneProject} from "./projects.get";

const BookingsRouter = new Router();

BookingsRouter.post("/", PostProjects);
BookingsRouter.get("/", GetMultipleProjects);
BookingsRouter.get("/:id", GetOneProject);

export default BookingsRouter;
