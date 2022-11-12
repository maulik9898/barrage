import { Menu, Button, Modal, NumberInput, Group, Tooltip } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconArrowsLeftRight, IconChevronsDown } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import useTorrentStore from "../stores/useTorrentStore";
import { humanFileSize } from "../utils/helper";
import { trpc } from "../utils/trpc";

const GlobalDown = () => {
  const stats = useTorrentStore((s) => s.stats);
  const [opened, setOpened] = useState(false);
  const setGlobalDown = trpc.deluge.setGlobalConfig.useMutation();
  const [numberValue, setNumberValue] = useInputState(stats.max_download);

  useEffect(() => {
    setNumberValue(stats.max_download);
  }, [stats.max_download]);

  const handleItem = (limit: number) => {
    setGlobalDown.mutate({
      data: {
        max_download_speed: limit,
      },
    });
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set Global Download Limit"
      >
        <NumberInput
          value={numberValue}
          onChange={setNumberValue}
          defaultValue={stats.max_download}
          label="Download Limit (KiB/s)"
          min={-1}
        />
        <Group mt={"sm"} position="right">
          <Button
            onClick={() => {
              handleItem(numberValue);
              setOpened(false)
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
            label="Global Download speed"
            position="bottom"
            zIndex={300}
            
            withArrow
            color={"green"}
          >
          <Button
            compact
            fullWidth
            radius={0}
            size={"xs"}
            leftIcon={<IconChevronsDown color="green" size={16} />}
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
            {`${humanFileSize(stats.download_rate)}/s ${
              stats.max_download !== -1
                ? "(" + humanFileSize(stats.max_download * 1024) + "/s)"
                : ""
            }`}
          </Button>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Limit DL Speed</Menu.Label>
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

export default GlobalDown;
