import * as Router from "koa-router"
import {GetImage, GetImageVariant} from "./images.get";
import PostImage from "./images.post";

const ImagesRouter = new Router();

ImagesRouter.post("/", PostImage);
ImagesRouter.get("/:id", GetImage);
ImagesRouter.get("/:id/:variant", GetImageVariant);

export default ImagesRouter;
