import {
  Card,
  Flex,
  Center,
  Title,
  MediaQuery,
  Box,
  Progress,
  useMantineTheme,
  Skeleton,
  Loader,
  Grid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconTriangleInverted, IconTriangle } from "@tabler/icons";
import Link from "next/link";
import React from "react";
import { humanFileSize, forHumansSeconds } from "../utils/helper";
import BadgeToolTip from "./BadgeToolTip";
import TorrentButtons from "./TorrentButtons";
import MemoizedTorrentMenu from "./TorrentMenu";

const ListSkeleton = () => {
  return (
    <Grid m={'auto'}  justify={'center'} align={"center"}>
      <Loader color={'dark.6'} size={150} variant="bars" />
    </Grid>
  );
};

export default ListSkeleton;
