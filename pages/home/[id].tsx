import { Alert, Group, SegmentedControl } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

import TorrentFiles from "../../components/TorrentFiles";
import TorrentPageNav from "../../components/TorrentPageNav";

import { useRouter } from "next/router";
import { useMediaQuery } from "@mantine/hooks";

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

    return (
      <>
        <TorrentPageNav name={name as string} />
        {/* <Group m={'sm'} position="center">
          <SegmentedControl
            fullWidth={!largeScreen}
            size={largeScreen ? "md" : 'sm'}
            data={[
              { label: "Status", value: "Status" },
              { label: "Details", value: "Details" },
              { label: "Files", value: "Files" },
              { label: "Peers", value: "Peers" },
              { label: "Options", value: "Options" },
            ]}
          />
        </Group> */}
        <Alert
          m={"sm"}
          icon={<IconAlertCircle size={16} />}
          title="Set priority using Dropdown menu"
          variant="light"
        >
          0 - Do not download &nbsp; &nbsp; &nbsp;
          <br /> 1 - Low &nbsp; &nbsp; &nbsp; 4 - Normal &nbsp; &nbsp; &nbsp; 5
          - High &nbsp; &nbsp; &nbsp; <br /> 7 - Highest priority
        </Alert>
        <TorrentFiles id={id as string} />
      </>
    );
  };

export default TorrentPage;
