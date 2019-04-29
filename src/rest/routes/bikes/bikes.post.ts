import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../middleware/require-permissions";
import {AuthLevel} from "../../../auth/role";
import {CreateBikeRequestSchema} from "../../schema/bikes";
import {BikeModel} from "../../../db/bike";

const PostBikes: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        const {title, description, price, categories} = await ctx.validateBody(CreateBikeRequestSchema);
        const bike = new BikeModel({title,description,price,categories});
        await bike.save();
        return bike.toCleanObject();
    }
]);
export default PostBikes;
