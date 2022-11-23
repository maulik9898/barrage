import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  MediaQuery,
  Paper,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronsDown,
  IconChevronsUp,
  IconNetwork,
  IconServer2,
  IconSpace,
} from "@tabler/icons";
import React from "react";
import useTorrentStore from "../stores/useTorrentStore";
import { humanFileSize } from "../utils/helper";
import GlobalConnection from "./GlobalConnection";
import GlobalDown from "./GlobalDown";
import GlobalUp from "./GlobalUp";

const Statusbar = () => {
  const stats = useTorrentStore((s) => s.stats);
  return (
    <Paper
      mb={0}
      sx={(theme) => ({
        background: theme.colors.dark[8],
        borderBottom: "1px solid",
        borderColor: theme.colors.gray[7],
      })}
      radius={0}
    >
      <Button.Group
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <GlobalDown />
        <GlobalUp />
        <GlobalConnection />

        <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
          <Tooltip
            withinPortal
            label="Free Storage"
            position="bottom"
            zIndex={300}
            withArrow
            color={"violet"}
          >
            <Button
              fullWidth
              compact
              size={"xs"}
              leftIcon={<IconServer2 color="violet" size={16} />}
              sx={(theme) => ({
                background: theme.colors.dark[8],
                borderRight: 0,
                borderColor: theme.colors.gray[7],
                borderBottom: 0,
                borderLeft: 0,
                borderTop: 0,
              })}
              radius={0}
              variant="default"
            >
              {`${humanFileSize(stats.free_space)}`}
            </Button>
          </Tooltip>
        </MediaQuery>
      </Button.Group>
    </Paper>
  );
};

export default Statusbar;
