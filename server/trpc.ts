import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";

// Avoid exporting the entire t-object since it's not very
// descriptive and can be confusing to newcomers used to t
// meaning translation in i18n libraries.
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
export const protectedProcedure = t.procedure.use(isAuthed);
