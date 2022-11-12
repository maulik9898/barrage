import {
  ActionIcon,
  Menu,
  Tooltip,
  Text,
  Select,
  Button,
  Popover,
  TextInput,
  Avatar,
  Group,
} from "@mantine/core";
import { IconFilter, IconMagnet } from "@tabler/icons";
import image from "next/image";
import React, { forwardRef, useEffect, useMemo } from "react";
import useTableStore from "../stores/useTableStore";
import useTorrentStore from "../stores/useTorrentStore";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  count: number;
  label: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ count, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Text w={15} color="dimmed">
          {count}
        </Text>
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);

const Filter = () => {
  const states = useTorrentStore((s) => s.states);
  const lables = useTorrentStore((s) => s.lables);
  const filter = useTableStore((s) => s.filter);
  const setFilter = useTableStore((s) => s.setFilter);
  const defaultLabel = (filter.find((s) => s.id === "label")?.value ||
    "All") as string;
  const defaultState = (filter.find((s) => s.id === "state")?.value ||
    "all") as string;
  const statesData = useMemo(() => {
    return [
      {
        value: "all",
        count: states.reduce((partial, sum) => partial + sum[1], 0),
        label: "All",
      },
      ...states.map((s) => ({
        value: s[0],
        count: s[1],
        label: s[0].charAt(0).toUpperCase() + s[0].slice(1),
      })),
    ];
  }, [states]);
  const lablesData = useMemo(() => {
    return lables.map((s) => ({
      value: s.name,
      count: s.count,
      label: s.name || "No Label",
    }));
  }, [lables]);
  return (
    <Popover withinPortal position="bottom-end" withArrow shadow="md">
      <Popover.Target>
        <Tooltip
          withinPortal
          label="Filter"
          position="bottom"
          withArrow
          color={"teal"}
        >
          <ActionIcon
            radius={"sm"}
            ml={"md"}
            sx={(theme) => ({
              borderWidth: 1,
              borderColor: theme.colors.teal,
            })}
            variant="light"
            color={"teal"}
            size={"xl"}
          >
            <IconFilter />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown
        sx={(theme) => ({
          background:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <Select
          defaultChecked
          label={"State"}
          labelProps={{}}
          placeholder="Pick one"
          data={statesData}
          itemComponent={SelectItem}
          defaultValue={defaultState}
          onChange={(e) => {
            if (e?.toLowerCase() === "all") {
              setFilter((old) => [
                ...old.filter((s) => s.id != "state"),
                {
                  id: "state",
                  value: "",
                },
              ]);
            } else {
              setFilter((old) => [
                ...old.filter((s) => s.id != "state"),
                {
                  id: "state",
                  value: e,
                },
              ]);
            }
          }}
          nothingFound="Nobody here"
        />
        <Select
          label={"Label"}
          placeholder="Pick one"
          mt={"sm"}
          itemComponent={SelectItem}
          onChange={(e) => {
            if (e?.toLowerCase() === "") {
              setFilter((old) => [
                ...old.filter((s) => s.id != "label"),
                {
                  id: "label",
                  value: "",
                },
              ]);
            } else {
              setFilter((old) => [
                ...old.filter((s) => s.id != "label"),
                {
                  id: "label",
                  value: e,
                },
              ]);
            }
          }}
          data={lablesData}
          defaultValue={defaultLabel}
          nothingFound="No Label"
        />
      </Popover.Dropdown>
    </Popover>
  );
};

export default Filter;
