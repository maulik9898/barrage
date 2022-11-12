import { TorrentState } from "../deluge/types";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconDeviceSdCard, IconPlayerPause,
  IconPlayerPlay,
  IconTrash
} from "@tabler/icons";
import { trpc } from "../utils/trpc";

const TorrentButtons = ({
  id,
  state,
  refetch,
}: {
  id: string;
  state: TorrentState;
  refetch: () => void;
}) => {
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
  return (
    <>
      {state !== TorrentState.paused ? (
        <ActionIcon
          sx={(theme) => ({
            borderWidth: 1,
            borderColor: theme.colors.gray[6],
          })}
          size={"lg"}
          variant="light"
          onClick={() => {
            pauseTorrent.mutate({ id: id });
          }}
        >
          <IconPlayerPause size={20} />
        </ActionIcon>
      ) : (
        <ActionIcon
          sx={(theme) => ({
            borderWidth: 1,
            borderColor: theme.colors.gray[6],
          })}
          size={"lg"}
          variant="light"
          onClick={() => {
            resumeTorrent.mutate({ id: id });
          }}
        >
          <IconPlayerPlay size={20} />
        </ActionIcon>
      )}
      <Menu
        shadow="md"
        width={200}
        withinPortal
        closeOnClickOutside
        closeOnEscape
        withArrow
        position="bottom-end"
      >
        <Menu.Target>
          <ActionIcon
            sx={(theme) => ({
              borderWidth: 1,
              borderColor: theme.colors.red,
            })}
            color={"red"}
            size={"lg"}
            variant="light"
          >
            <IconTrash size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
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

export default TorrentButtons;
