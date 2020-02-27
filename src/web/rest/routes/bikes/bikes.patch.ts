import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../../../middleware/require-permissions";
import {AuthLevel} from "../../../../auth/role";
import {PatchBikeRequestSchema} from "../../schema/bikes";
import * as Logic from "../../../logic/bikes";
import {ObjectId} from "../../../schema/common";

const PatchBike: Koa.Middleware = compose([
    RequirePermission(AuthLevel.Manager),
    async (ctx: Koa.Context) => {
        const {id} = ctx.params;
        if (ObjectId().validate(id).error) {
            return ctx.throw(404);
        }

        const form = await ctx.validateBody(PatchBikeRequestSchema);
        const success = await Logic.updateBike(ctx, id, form);

        if (success) {
            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
        return {success};
    }
]);

export default PatchBike;
