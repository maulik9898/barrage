import {
  ColumnFiltersState,
  functionalUpdate,
  OnChangeFn,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import create from "zustand";
import { Label, Stats, TorrentState } from "../deluge";

interface TorrentStoreState {
  lables: Label[];
  states: Array<[TorrentState, number]>;
  isv2: boolean;
  stats: Stats;
  setStats: (stats: Stats) => void;
  setIsv2: (v2: boolean) => void;
  setState: (states: Array<[TorrentState, number]>) => void;
  setLables: (labels: Label[]) => void;
}

const useTorrentStore = create<TorrentStoreState>((set) => ({
  lables: [],
  stats: {
    dht_nodes: 0,
    download_protocol_rate: 0,
    download_rate: 0,
    free_space: 0,
    has_incoming_connections: false,
    max_download: 0,
    max_num_connections: 0,
    max_upload: 0,
    num_connections: 0,
    upload_protocol_rate: 0,
    upload_rate: 0,
  },
  isv2: true,
  states: [],
  setIsv2: (v2) =>
    set(() => ({
      isv2: v2,
    })),
  setLables: (labels: Label[]) =>
    set(() => ({
      lables: labels,
    })),
  setState: (states) =>
    set(() => ({
      states: states,
    })),
  setStats: (stats) =>
    set(() => ({
      stats: stats,
    })),
}));

export default useTorrentStore;
