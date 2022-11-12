import { Menu, Tooltip, ActionIcon, Modal } from "@mantine/core";
import { IconPlus, IconMagnet, IconLink, IconFile } from "@tabler/icons";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import AddTorrentModal from "./AddTorrentModal";

const AddTorrentButton = () => {
  const [opened, setOpened] = useState(false);
  
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add Torrents"
      >
        <AddTorrentModal close={()=> {
          setOpened(false)
        }} />
      </Modal>
      <Menu
        shadow="md"
        width={200}
        withinPortal
        closeOnClickOutside
        closeOnEscape
        withArrow
        position="bottom-start"
      >
        <Menu.Target>
          <Tooltip
            withinPortal
            label="Add"
            position="bottom"
            zIndex={300}
            withArrow
            color={"blue"}
          >
            <ActionIcon
              radius={"sm"}
              sx={(theme) => ({
                borderWidth: 1,
                borderColor: theme.colors.blue,
              })}
              mr={"md"}
              variant="light"
              color={"blue"}
              size={"xl"}
            >
              <IconPlus />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Add Torrent</Menu.Label>
          <Menu.Item onClick={() => setOpened(true)} icon={<IconMagnet size={14} />}>Magnet</Menu.Item>
          {/* <Menu.Item icon={<IconLink size={14} />}>URL</Menu.Item>
          <Menu.Item icon={<IconFile size={14} />}>File</Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default AddTorrentButton;
