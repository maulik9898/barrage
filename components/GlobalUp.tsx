import {
  Menu,
  Button,
  Group,
  Modal,
  NumberInput,
  Tooltip,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconArrowsLeftRight, IconChevronsUp } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import useTorrentStore from "../stores/useTorrentStore";
import { humanFileSize } from "../utils/helper";
import { trpc } from "../utils/trpc";

const GlobalUp = () => {
  const stats = useTorrentStore((s) => s.stats);
  const setGlobalUp = trpc.deluge.setGlobalConfig.useMutation();
  const [numberValue, setNumberValue] = useInputState(stats.max_upload);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setNumberValue(stats.max_upload);
  }, [stats.max_upload]);

  const handleItem = (limit: number) => {
    setGlobalUp.mutate({
      data: {
        max_upload_speed: limit,
      },
    });
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set Global Upload Limit"
      >
        <NumberInput
          value={numberValue}
          onChange={setNumberValue}
          defaultValue={stats.max_upload}
          label="Upload Limit (KiB/s)"
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
            label="Global Upload Speed"
            position="bottom"
            zIndex={300}
            withArrow
            color={"teal"}
          >
            <Button
              compact
              fullWidth
              radius={0}
              size={"xs"}
              leftIcon={<IconChevronsUp color="teal" size={16} />}
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
              {`${humanFileSize(stats.upload_rate)}/s ${
                stats.max_upload !== -1
                  ? "(" + humanFileSize(stats.max_upload * 1024) + "/s)"
                  : ""
              }`}
            </Button>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Limit UP Speed</Menu.Label>
          <Menu.Item onClick={() => handleItem(200)}>200 KiB/s</Menu.Item>
          <Menu.Item onClick={() => handleItem(500)}>500 KiB/s</Menu.Item>
          <Menu.Item onClick={() => handleItem(1024)}>1 MiB/s</Menu.Item>
          <Menu.Item onClick={() => handleItem(3 * 1024)}>3 MiB/s</Menu.Item>
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
    </>
  );
};

export default GlobalUp;
