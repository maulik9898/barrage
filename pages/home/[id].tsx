import { Box, Center, SegmentedControl, Tabs } from "@mantine/core";

import TorrentFiles from "../../components/TorrentFiles";
import TorrentPageNav from "../../components/TorrentPageNav";

import { useRouter } from "next/router";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import TorrentDetail from "../../components/TorrentDetail";
import TorrentOption from "../../components/TorrentOption";
import { IconFiles, IconListDetails, IconTableOptions } from "@tabler/icons";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import useTorrentStore from "../../stores/useTorrentStore";

const enum Segments {
  DETAILS = "Details",
  FILES = "Files",
  OPTIONS = "Options",
}

// export const getServerSideProps = requireAuth(async (ctx) => {
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
//   const id = ctx.params?.id as string;

//   /*
//    * Prefetching the `post.byId` query here.
//    * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
//    */

//   await ssg.deluge.getFiles.prefetch({ id });
//   // Make sure to return { props: { trpcState: ssg.dehydrate() } }
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//     },
//   };
// });

const TorrentPage = () =>
  //props: InferGetServerSidePropsType<typeof getServerSideProps>
  {
    const router = useRouter();
    const { id, name } = router.query;
    const largeScreen = useMediaQuery("(min-width: 800px)");
    const [segments, setSegments] = useInputState<string>(Segments.DETAILS);
    const setIsv2 = useTorrentStore((s) => s.setIsv2);
    const info = trpc.deluge.getHostInfo.useMutation();

    const trpcContext = trpc.useContext();

    useEffect(() => {
      trpcContext.deluge.getFiles.prefetch({ id: id as string });
    }, []);

    useEffect(() => {
      info.mutate();
    }, []);

    return (
      <>
        <TorrentPageNav name={name as string} />
        <Center>
          <SegmentedControl
            w={largeScreen ? "50%" : "100%"}
            size={"sm"}
            value={segments}
            onChange={(e) => setSegments(e)}
            m={"sm"}
            data={[
              {
                label: (
                  <Center>
                    <IconListDetails size={16} />
                    <Box ml={10}>Details</Box>
                  </Center>
                ),
                value: Segments.DETAILS,
              },
              {
                label: (
                  <Center>
                    <IconFiles size={16} />
                    <Box ml={10}>Files</Box>
                  </Center>
                ),
                value: Segments.FILES,
              },
              {
                label: (
                  <Center>
                    <IconTableOptions size={16} />
                    <Box ml={10}>Options</Box>
                  </Center>
                ),
                value: Segments.OPTIONS,
              },
            ]}
          />
        </Center>
        <Tabs value={segments} variant="pills">
          <Tabs.Panel value={Segments.DETAILS}>
            <TorrentDetail id={id as string} />
          </Tabs.Panel>

          <Tabs.Panel value={Segments.FILES}>
            <TorrentFiles id={id as string} />
          </Tabs.Panel>

          <Tabs.Panel value={Segments.OPTIONS}>
            <TorrentOption id={id as string} />
          </Tabs.Panel>
        </Tabs>

        {}
      </>
    );
  };

export default TorrentPage;
