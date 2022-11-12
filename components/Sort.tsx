import { Tooltip, ActionIcon, Menu, Box } from "@mantine/core";
import {
  IconSortAscending2,
  IconSortDescending,
  IconSortDescending2,
} from "@tabler/icons";
import { Column, SortDirection, Table } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { NormalizedTorrent } from "../deluge/types";
import useTableStore from "../stores/useTableStore";
import useTorrentStore from "../stores/useTorrentStore";

const Sort = () => {
  const setSorting = useTableStore((state) => state.setSorting);
  const columns = useTableStore((state) => state.columns);

  return (
    <Menu
      shadow="md"
      withinPortal
      closeOnClickOutside
      closeOnEscape
      withArrow
      position="bottom-end"
    >
      <Menu.Target>
        <Tooltip
          withinPortal
          label="Sort"
          position="bottom"
          withArrow
          color={"lime"}
        >
          <ActionIcon
            radius={"sm"}
            ml={"md"}
            sx={(theme) => ({
              borderWidth: 1,
              borderColor: theme.colors.lime,
            })}
            variant="light"
            color={"lime"}
            size={"xl"}
          >
            <IconSortDescending />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {columns.map((c) => {
          return (
            <Menu.Item
              key={c.id}
              rightSection={
                <Box ml={"md"}>
                  {{
                    asc: <IconSortAscending2 size={18} />,
                    desc: <IconSortDescending2 size={18} />,
                  }[c.getIsSorted() as string] ?? null}
                </Box>
              }
              onClick={() => {
                setSorting([
                  {
                    id: c.id,
                    desc: c.getIsSorted() ? c.getIsSorted() == "asc" : true,
                  },
                ]);
              }}
            >
              {c.columnDef.header?.toString()}
            </Menu.Item>
          );
        })}
        {/* <Menu.Item icon={<IconLink size={14} />}>URL</Menu.Item>
              <Menu.Item icon={<IconFile size={14} />}>File</Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  );
};
export default Sort;
