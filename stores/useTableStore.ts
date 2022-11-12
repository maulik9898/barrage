import {
  ColumnFiltersState,
  SortingState,
  OnChangeFn,
  functionalUpdate,
  Updater,
  Column,
  PaginationState,
} from "@tanstack/react-table";
import create from "zustand";
import { NormalizedTorrent } from "../deluge";
import useTorrentStore from "./useTorrentStore";

interface TableStoreState {
  filter: ColumnFiltersState;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  pagination: PaginationState;
  setFilter: OnChangeFn<ColumnFiltersState>;
  columns: Column<NormalizedTorrent, unknown>[];
  setColumns: (columns: Column<NormalizedTorrent, unknown>[]) => void;
  setPagination: OnChangeFn<PaginationState>;
}

const useTableStore = create<TableStoreState>((set) => ({
  filter: [],
  columns: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [
    {
      id: "queuePosition",
      desc: false,
    },
  ],
  setSorting: (sortingState: Updater<SortingState>) =>
    set((s) => ({
      sorting: functionalUpdate(sortingState, s.sorting),
    })),
  setFilter: (filterState: Updater<ColumnFiltersState>) =>
    set((s) => ({
      pagination: { ...s.pagination, ...{ pageIndex: 0 } },
      filter: functionalUpdate(filterState, s.filter),
    })),
  setColumns: (columns) =>
    set(() => ({
      columns: columns,
    })),
  setPagination: (pagination) =>
    set((s) => ({
      pagination: functionalUpdate(pagination, s.pagination),
    })),
}));

export default useTableStore;
