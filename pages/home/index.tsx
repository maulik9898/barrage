/* eslint-disable react-hooks/exhaustive-deps */
import TorrentList from "../../components/TorrentList";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import useTorrentStore from "../../stores/useTorrentStore";
import { useEffect, useMemo, useState } from "react";
import { NormalizedTorrent } from "../../deluge";
import { trpc } from "../../utils/trpc";
import MemoizedNavBar from "../../components/NavBar";
import useTableStore from "../../stores/useTableStore";
import NavBar from "../../components/NavBar";
import { Box, Group, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Statusbar from "../../components/Statusbar";

// export const getServerSideProps = requireAuth(async (ctx) => {
//   const isFirstServerCall = ctx.req?.url?.indexOf("/_next/data/") === -1;
//   if (!isFirstServerCall) {
//     return {
//       props: {},
//     };
//   }
//   const session = await unstable_getServerSession(
//     ctx.req,
//     ctx.res,
//     nextAuthOptions
//   );
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: {
//       session: session,
//     },
//   });
//   /*
//    * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
//    */
//   await ssg.deluge.allData.prefetch();

//   // Make sure to return { props: { trpcState: ssg.dehydrate() } }
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//     },
//   };
// });

export default function Home() {
  const router = useRouter();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  if (status === "loading") {
    return <></>;
  }
  return (
    <Stack
      mb={"sm"}
      h={"100vh"}
      spacing={"sm"}
      justify={"flex-start"}
      align={"stretch"}
    >
     
      <NavBar />
      <TorrentList />
    </Stack>
  );
}
