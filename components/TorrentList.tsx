/* eslint-disable react-hooks/exhaustive-deps */
import {
  Affix,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Pagination,
  Paper,
  Select,
  Text,
  Transition,
} from "@mantine/core";
import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowModel,
  Sorting,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { NormalizedTorrent } from "../deluge";
import useTableStore from "../stores/useTableStore";
import useTorrentStore from "../stores/useTorrentStore";
import { trpc } from "../utils/trpc";
import Torrent from "./Torrent";
import { rankItem } from "@tanstack/match-sorter-utils";
import { IconArrowUp } from "@tabler/icons";
import { useMediaQuery, useWindowScroll } from "@mantine/hooks";
import ListSkeleton from "./ListSkeleton";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  if (value.toLowerCase() === "all") {
    return true;
  }
  const rowValue = row.getValue(columnId);
  if (value === "") {
    return rowValue === value;
  }
  const itemRank = rankItem(row.getValue(columnId), value);
  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const columnHelper = createColumnHelper<NormalizedTorrent>();
const columns = [
  columnHelper.accessor("downloadSpeed", {
    id: "downloadSpeed",
    enableSorting: true,
    enableColumnFilter: false,
    header: "Download Speed",
  }),
  columnHelper.accessor("name", {
    id: "name",
    enableSorting: true,
    enableColumnFilter: true,
    header: "Name",
  }),
  columnHelper.accessor("label", {
    id: "label",
    enableSorting: true,
    enableColumnFilter: true,
    header: "Label",
    filterFn: fuzzyFilter,
  }),
  columnHelper.accessor("progress", {
    id: "progress",
    enableSorting: true,
    enableColumnFilter: false,
    header: "Progress",
  }),
  columnHelper.accessor("queuePosition", {
    id: "queuePosition",
    enableSorting: true,
    header: "Queue Position",
  }),
  columnHelper.accessor("state", {
    id: "state",
    enableSorting: true,
    enableColumnFilter: true,
    header: "Download State",
  }),
  columnHelper.accessor("totalSelected", {
    id: "totalSelected",
    enableSorting: true,
    enableColumnFilter: false,
    header: "Total Size",
  }),
];

const TorrentList = () => {
  const router = useRouter();
  const setLabels = useTorrentStore((state) => state.setLables);
  const { setState, setStats } = useTorrentStore();
  const [scroll, scrollTo] = useWindowScroll();
  const {
    filter,
    setFilter,
    setSorting,
    sorting,
    setColumns,
    pagination,
    setPagination,
  } = useTableStore();

  const largeScreen = useMediaQuery("(min-width: 800px)");

  const [data, setData] = useState<NormalizedTorrent[]>([]);
  const torrents = trpc.deluge.allData.useQuery(undefined, {
    refetchInterval: 1500,
    onSuccess(data) {
      setStats(data.raw.result.stats);
    },
  });

  useEffect(() => {
    if (torrents.data?.labels) {
      setLabels(torrents.data.labels);
    }
  }, [torrents.data?.labels]);

  useEffect(() => {
    if (torrents.data?.state) {
      setState(torrents.data.state);
    }
  }, [torrents.data?.state]);

  const torrentTable = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    columns: columns,
    state: {
      sorting,
      columnFilters: filter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilter,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  useEffect(() => {
    if (torrents.data?.torrents) {
      setData(torrents.data.torrents);
    }
  }, [torrents.data?.torrents]);

  const AllColums = torrentTable.getAllColumns();

  useEffect(() => {
    if (AllColums) {
      console.log("cols change");
      setColumns(AllColums.filter((e) => e.getCanSort));
    }
  }, [sorting, filter]);

  if (torrents.isLoading) {
    return <ListSkeleton />;
  }

  return (
    <Box pb={"sm"}>
      <Paper>
        {torrentTable.getRowModel().rows.map((torrent) => {
          return (
            <Torrent
              key={torrent.original.id}
              torrent={torrent.original}
              refetch={torrents.refetch}
            />
          );
        })}
      </Paper>

      <Flex wrap={"wrap"} gap={largeScreen ? "xl" : "sm"} justify={"center"}>
        <Pagination
          size={largeScreen ? "lg" : "md"}
          total={torrentTable.getPageCount()}
          withControls={largeScreen}
          boundaries={largeScreen ? 2 : 0}
          withEdges
          page={torrentTable.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            torrentTable.setPageIndex(e - 1);
          }}
          siblings={largeScreen ? 2 : 1}
          initialPage={torrentTable.getState().pagination.pageIndex + 1}
        />
        <Flex gap={largeScreen ? "xl" : "sm"} justify={"center"}>
          <Center>
            <Text size={"xs"}>Goto Page:</Text>
            <Select
              data={Array.from(
                { length: torrentTable.getPageCount() },
                (x, i) => i + 1
              ).map((s) => s.toString())}
              size={largeScreen ? "sm" : "xs"}
              ml={"xs"}
              value={(
                torrentTable.getState().pagination.pageIndex + 1
              ).toString()}
              styles={(theme) => ({
                input: {
                  width: largeScreen ? "50px" : "45px",
                  padding: "4px",
                  textAlign: "center",
                },
                rightSection: {
                  display: "none",
                },
              })}
              onChange={(e) => {
                if (!e) return;
                if (parseInt(e)) {
                  torrentTable.setPageIndex(parseInt(e) - 1);
                }
              }}
            />
          </Center>
          <Center>
            <Text size={"xs"}>Page Size:</Text>
            <Select
              data={["5", "10", "20", "30", "40"]}
              size={largeScreen ? "sm" : "xs"}
              ml={"xs"}
              defaultValue={torrentTable
                .getState()
                .pagination.pageSize.toString()}
              styles={(theme) => ({
                input: {
                  width: largeScreen ? "55px" : "45px",
                  padding: "4px",
                  textAlign: "center",
                },
                rightSection: {
                  display: "none",
                },
              })}
              onChange={(e) => {
                if (!e) return;
                if (parseInt(e)) {
                  torrentTable.setPageSize(parseInt(e));
                }
              }}
            />
          </Center>
        </Flex>
      </Flex>

      {/* <Affix style={{ width: "100%" }} position={{ bottom: 100, left: 0 }}>
        <Transition
          timingFunction="ease"
          transition="slide-up"
          mounted={scroll.y > 0}
        >
          {(transitionStyles) => (
            <Flex justify={"center"} style={transitionStyles}>
              <Button
                leftIcon={<IconArrowUp size={16} />}
                onClick={() => scrollTo({ y: -1 })}
              >
                Scroll to top
              </Button>
            </Flex>
          )}
        </Transition>
      </Affix> */}
    </Box>
  );
};

export default TorrentList;
