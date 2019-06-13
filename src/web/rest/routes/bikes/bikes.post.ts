import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
import {CreateBikeRequestSchema} from "../../schema/bikes";
import * as Logic from "../../../logic/bikes";

const PostBikes: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async ctx => {
        const form = await ctx.validateBody(CreateBikeRequestSchema);

        const bike = await Logic.createBike(ctx, form);

        ctx.status = 201;
        return bike.toCleanObject();
    }
]);
export default PostBikes;
