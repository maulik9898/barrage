import { ActionIcon, Menu, Modal } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronsDown,
  IconChevronsUp,
  IconChevronUp,
  IconDatabaseExport,
  IconDeviceSdCard,
  IconDotsVertical,
  IconListNumbers,
  IconPlayerPause,
  IconPlayerPlay,
  IconSettings,
  IconTrash,
  IconZoomCheck,
} from "@tabler/icons";
import { memo, useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import Label from "./Label";
import Options from "./Options";

const TorrentMenu = ({ id, refetch }: { id: string; refetch: () => void }) => {
  const [opened, setOpened] = useState(false);
  const top = trpc.deluge.queueTop.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const up = trpc.deluge.queueUp.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const down = trpc.deluge.queueDown.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const bottom = trpc.deluge.queueBottom.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const pauseTorrent = trpc.deluge.pause.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const resumeTorrent = trpc.deluge.resume.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteTorrent = trpc.deluge.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const forceRecheck = trpc.deluge.forceRecheck.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set Options"
      >
        <Options id={id} />
      </Modal>
      <Menu withinPortal withArrow position="bottom-end" shadow="md">
        <Menu.Target>
          <ActionIcon size={"lg"} variant="default">
            <IconDotsVertical size={20} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() => pauseTorrent.mutate({ id })}
            icon={<IconPlayerPause size={14} />}
          >
            Pause
          </Menu.Item>
          <Menu.Item
            onClick={() => resumeTorrent.mutate({ id })}
            icon={<IconPlayerPlay size={14} />}
          >
            Resume
          </Menu.Item>
          <Menu.Divider />
          <Label id={id} refetch={refetch} />
          <Menu.Divider />
          <Menu.Item
            onClick={() => {
              setOpened(true);
            }}
            icon={<IconSettings size={14} />}
          >
            Options
          </Menu.Item>
          <Menu.Divider />

          <Menu position="left-start" withinPortal withArrow>
            <Menu.Target>
              <Menu.Item
                closeMenuOnClick={false}
                rightSection={<IconChevronRight size={14} />}
                icon={<IconListNumbers size={14} />}
              >
                Queue
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => {
                  top.mutate({ id });
                }}
                icon={<IconChevronsUp size={14} />}
              >
                Top
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  up.mutate({ id });
                }}
                icon={<IconChevronUp size={14} />}
              >
                Up
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  down.mutate({ id });
                }}
                icon={<IconChevronDown size={14} />}
              >
                Down
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  bottom.mutate({ id });
                }}
                icon={<IconChevronsDown size={14} />}
              >
                Bottom
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu.Divider />
          <Menu.Item
            onClick={() => {
              forceRecheck.mutate({ id: id });
            }}
            icon={<IconZoomCheck size={14} />}
          >
            Force Recheck
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Delete Torrent</Menu.Label>
          <Menu.Item
            onClick={() => {
              deleteTorrent.mutate({ id: id, removeData: false });
            }}
            icon={<IconTrash size={14} />}
          >
            Delete
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              deleteTorrent.mutate({ id: id, removeData: true });
            }}
            color={"red"}
            icon={<IconDeviceSdCard size={14} />}
          >
            Delete with data
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

const MemoizedTorrentMenu = memo(TorrentMenu);
export default MemoizedTorrentMenu;
