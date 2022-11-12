/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Card,
  Center,
  DefaultMantineColor,
  Flex,
  MediaQuery,
  Progress,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useHover, useMediaQuery } from "@mantine/hooks";
import { IconTriangle, IconTriangleInverted } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NormalizedTorrent, TorrentState } from "../deluge/types";
import { forHumansSeconds, humanFileSize } from "../utils/helper";
import { trpc } from "../utils/trpc";
import BadgeToolTip from "./BadgeToolTip";
import TorrentButtons from "./TorrentButtons";
import MemoizedTorrentMenu from "./TorrentMenu";
import TorrentMenu from "./TorrentMenu";

const getStatusTextColor = (
  state: TorrentState
): DefaultMantineColor | "dimmed" => {
  switch (state) {
    case TorrentState.downloading:
      return "green";
    case TorrentState.checking:
      return "blue";
    case TorrentState.paused:
      return "yellow";
    case TorrentState.seeding:
      return "teal"
    case TorrentState.error:
    case TorrentState.unknown:
    case TorrentState.warning:
      return "red";
  }
  return "dimmed";
};

const Torrent = ({
  torrent,
  refetch,
}: {
  torrent: NormalizedTorrent;
  refetch: () => void;
}) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const statusColor = getStatusTextColor(torrent.state);
  const { hovered, ref } = useHover();
  const prefetch = trpc.useContext();
  const largeScreen = useMediaQuery("(min-width: 800px)");

  useEffect(() => {
    if (hovered) {
      prefetch.deluge.getFiles.prefetch(
        { id: torrent.id },
        {
          staleTime: 5000,
        }
      );
    }
  }, [hovered, torrent.id]);

  return (
    <Card
      shadow={"sm"}
      radius={"md"}
      m={"md"}
      withBorder
      sx={{
        backgroundColor: theme.colors.dark[9],
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[4],
        },
      }}
    >
      <Flex gap={"sm"}>
        <Flex
          w={"100%"}
          gap={"sm"}
          wrap={"nowrap"}
          justify={"space-between"}
          direction={"column"}
        >
          <Flex align={"center"} justify={"space-between"} gap={"xs"}>
            <div ref={ref}>
              <Center>
                <Title
                  color={"dimmed"}
                  weight={800}
                  order={largeScreen ? 2 : 3}
                >{`#${torrent.queuePosition}`}</Title>

                <Text
                  component={Link}
                  lineClamp={1}
                  weight={700}
                  ml={largeScreen ? 'xs' : 4}
                  as={`/home/${torrent.id}`}
                  replace={true}
                  href={{
                    pathname: `/home/${torrent.id}`,
                    query: { name: torrent.name },
                  }}
                  sx={{
                    flex: 1,
                    wordBreak: "break-all",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline  solid ",
                    },
                  }}
                >
                  {torrent.name}
                </Text>
              </Center>
            </div>
            <MediaQuery
              largerThan={"sm"}
              styles={{
                display: "none",
              }}
            >
              <Box>
                <MemoizedTorrentMenu id={torrent.id} refetch={refetch} />
              </Box>
            </MediaQuery>
          </Flex>
          <Flex
            wrap={"wrap"}
            align={"center"}
            gap={{ sm: "xs", md: "md" }}
            justify={"space-between"}
            sx={(theme) => ({
              gap: theme.spacing.xs,
              "@media (min-width: 800)": {
                gap: theme.spacing.md,
              },
            })}
          >
            <Flex gap={"xs"}>
              <Text color={"dimmed"} weight={600} size={"xs"}>{`${humanFileSize(
                torrent.totalDownloaded
              )} / ${humanFileSize(torrent.totalSelected)}`}</Text>
              {torrent.label && (
                <BadgeToolTip toolTipLabel="Torrent tag" tag={torrent.label} />
              )}
            </Flex>

            {torrent.eta != 0 && (
              <Text size={"xs"} weight={"bolder"} color={"dimmed"}>
                {forHumansSeconds(torrent.eta)}
              </Text>
            )}
          </Flex>
          <Flex align={"center"} gap={"md"}>
            <Progress
              style={{ flexGrow: 1 }}
              size={10}
              value={torrent.progress * 100}
              radius={"lg"}
            />
          </Flex>
          <Flex align={"center"} gap={"xs"} justify={"space-between"}>
            <Flex align={"center"}>
              <Text mr={"xs"} color={statusColor} weight={600} size={"xs"}>
                {torrent.stateMessage}
              </Text>
              <Center inline>
                <IconTriangleInverted size={14} />
                <Text
                  ml={5}
                  color={statusColor}
                  weight={600}
                  size={"xs"}
                  mr={5}
                >
                  {` ${humanFileSize(torrent.downloadSpeed)}/s`}
                </Text>
                <IconTriangle size={14} />
                <Text ml={5} color={statusColor} weight={600} size={"xs"}>
                  {`${humanFileSize(torrent.uploadSpeed)}/s`}
                </Text>
              </Center>
            </Flex>
            <Title order={6} weight={"bold"}>{`${(
              torrent.progress * 100
            ).toFixed(2)}%`}</Title>
          </Flex>
        </Flex>
        <MediaQuery
          smallerThan={"sm"}
          styles={{
            display: "none",
          }}
        >
          <Flex justify={"space-between"} direction={"column"} align={"center"}>
            <MemoizedTorrentMenu id={torrent.id} refetch={refetch} />
            <TorrentButtons
              id={torrent.id}
              refetch={refetch}
              state={torrent.state}
            />
          </Flex>
        </MediaQuery>
      </Flex>
    </Card>
  );
};

export default Torrent;
