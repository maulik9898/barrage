// @/src/common/requireAuth.ts
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "./nextAuthOption";

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      nextAuthOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: "/", // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
