import {
  Menu,
  Button,
  Modal,
  NumberInput,
  Group,
  Tooltip,
  MediaQuery,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import {
  IconArrowsLeftRight,
  IconChevronsDown,
  IconNetwork,
} from "@tabler/icons";
import React, { useEffect, useState } from "react";
import useTorrentStore from "../stores/useTorrentStore";
import { humanFileSize } from "../utils/helper";
import { trpc } from "../utils/trpc";

const GlobalConnection = () => {
  const stats = useTorrentStore((s) => s.stats);
  const [opened, setOpened] = useState(false);
  const setGlobalConnection = trpc.deluge.setGlobalConfig.useMutation();
  const [numberValue, setNumberValue] = useInputState(
    stats.max_num_connections
  );

  useEffect(() => {
    setNumberValue(stats.max_num_connections);
  }, [stats.max_num_connections]);

  const handleItem = (limit: number) => {
    setGlobalConnection.mutate({
      data: {
        max_connections_global: limit,
      },
    });
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set Global Connection Limit"
      >
        <NumberInput
          value={numberValue}
          onChange={setNumberValue}
          defaultValue={stats.max_num_connections}
          label="Connection Limit"
          min={-1}
        />
        <Group mt={"sm"} position="right">
          <Button
            onClick={() => {
              handleItem(numberValue);
              setOpened(false);
            }}
          >
            Set
          </Button>
        </Group>
      </Modal>
      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Menu
          styles={(theme) => ({
            item: {
              fontSize: theme.fontSizes.xs,
            },
          })}
          withArrow
          withinPortal
          shadow="md"
        >
          <Menu.Target>
            <Tooltip
              withinPortal
              label="Global connections"
              position="bottom"
              zIndex={300}
              withArrow
              color={"cyan"}
            >
              <Button
                compact
                fullWidth
                radius={0}
                size={"xs"}
                leftIcon={<IconNetwork color="cyan" size={16} />}
                sx={(theme) => ({
                  background: theme.colors.dark[8],
                  borderRight: "1px solid",
                  borderColor: theme.colors.gray[7],
                  borderBottom: 0,
                  borderLeft: 0,
                  borderTop: 0,
                })}
                variant="default"
              >
                {`${stats.num_connections} ${
                  stats.max_num_connections !== -1
                    ? "(" + stats.max_num_connections + ")"
                    : ""
                }`}
              </Button>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Limit Connections</Menu.Label>
            <Menu.Item onClick={() => handleItem(50)}>50</Menu.Item>
            <Menu.Item onClick={() => handleItem(100)}>100</Menu.Item>
            <Menu.Item onClick={() => handleItem(200)}>200</Menu.Item>
            <Menu.Item onClick={() => handleItem(500)}>500</Menu.Item>
            <Menu.Item onClick={() => handleItem(-1)}>Unlimited</Menu.Item>
            <Menu.Divider />

            <Menu.Item
              onClick={() => setOpened(true)}
              icon={<IconArrowsLeftRight size={14} />}
            >
              Other
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </MediaQuery>
    </>
  );
};

export default GlobalConnection;
