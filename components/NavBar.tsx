import {
  ActionIcon,
  Card,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconFilter, IconSearch, IconSortDescending } from "@tabler/icons";
import { Column, Table } from "@tanstack/react-table";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { NormalizedTorrent } from "../deluge";
import { router } from "../server/trpc";
import useTableStore from "../stores/useTableStore";
import useTorrentStore from "../stores/useTorrentStore";
import { trpc } from "../utils/trpc";
import AddTorrentButton from "./AddTorrentButton";
import Filter from "./Filter";
import MemoizedSort from "./Sort";
import Sort from "./Sort";
import Statusbar from "./Statusbar";

const NavBar = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const setFilter = useTableStore((s) => s.setFilter);
  const filter = useTableStore((s) => s.filter);
  const [value, setValue] = useState<string>(
    (filter.find((s) => s.id === "name")?.value as string) || ""
  );
  const [debounced] = useDebouncedValue(value, 200);

  const info = trpc.deluge.getHostInfo.useMutation();
  const setIsv2 = useTorrentStore((s) => s.setIsv2);
  useEffect(() => {
    info.mutate();
  }, []);

  useEffect(() => {
    if (info.data) {
      const isv2 = info.data[0] === "2";
      console.log(isv2);
      setIsv2(isv2);
    }
  }, [info.data]);

  useEffect(() => {
    setFilter((old) => [
      ...old.filter((s) => s.id != "name"),
      {
        id: "name",
        value: debounced,
      },
    ]);
  }, [debounced]);

  return (
    <Card
      sx={{
        overflow: "unset",
      }}
      radius={0}
      shadow={"lg"}
      withBorder
    >
      <Card.Section>
        <Statusbar />
      </Card.Section>

      <Card.Section
        p={"md"}
        sx={{
          display: "flex",
        }}
      >
        <AddTorrentButton />

        <TextInput
          size="md"
          value={value}
          sx={{
            flexGrow: 1,
            alignSelf: "center",
          }}
          onChange={(event) => setValue(event.currentTarget.value)}
          styles={{ input: { background: theme.colors.dark[8] } }}
          placeholder="Search Torrents"
          icon={<IconSearch />}
        />

        <Sort />
        <Filter />
      </Card.Section>
    </Card>
  );
};
export default NavBar;
