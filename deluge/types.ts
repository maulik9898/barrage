import { Agents } from "got/dist/source/core/options";
import { z } from "zod";

export interface DefaultResponse {
  /**
   * mostly usless id that increments with every request
   */
  id: number;
  error: null | string;
  result: any;
}

export interface BooleanStatus extends DefaultResponse {
  result: boolean;
}

export interface StringStatus extends DefaultResponse {
  result: string;
}

export interface ListMethods extends DefaultResponse {
  result: string[];
}

export interface AddTorrentResponse extends DefaultResponse {
  result: Array<[boolean, string]>;
}

// {"files": ["/tmp/delugeweb-5Q9ttR/tmpL7xhth.torrent"], "success": true}
/**
 * ex -
 */
export interface UploadResponse {
  /**
   * ex - `["/tmp/delugeweb-5Q9ttR/tmpL7xhth.torrent"]`
   */
  files: string[];
  success: boolean;
}

export interface GetHostsResponse extends DefaultResponse {
  /**
   * host id - ddf084f5f3d7945597991008949ea7b51e6b3d93
   * ip address - 127.0.0.1
   * port - 58846
   * status - "Online"
   */
  result: Array<[string, string, number, string]>;
}

export type HostStatus = "Online" | "Offline" | "Connected";
export interface GetHostStatusResponse extends DefaultResponse {
  /**
   * host id - ddf084f5f3d7945597991008949ea7b51e6b3d93
   * status - "Online"
   * version - "1.3.15"
   */
  result: Array<string | number>;
}

export interface TorrentInfo extends DefaultResponse {
  result: TorrentInfoResult;
}

export enum ContentType {
  FILE = "file",
  DIR = "dir",
}

export interface Content {
  priority: number;
  index?: number;
  offset?: number;
  progress: number;
  path: string;
  type: ContentType;
  size: number;
  progresses?: number[];
  contents?: Record<string, Content>;
}

export interface TorrentInfoResult {
  files_tree: {
    contents: Record<string, Content>;
  };
  name: string;
  info_hash: string;
}

export interface AddTorrentOptions {
  file_priorities: any[];
  add_paused: boolean;
  compact_allocation?: boolean;
  download_location?: string;
  max_connections: number;
  max_download_speed: number;
  max_upload_slots: number;
  max_upload_speed: number;
  prioritize_first_last_pieces: boolean;
  move_completed: boolean;
  move_completed_path?: string;
  pre_allocate_storage?: boolean;
  sequential_download?: boolean;
  seed_mode?: boolean;
  super_seeding?: boolean;
}

export interface TorrentListResponse extends DefaultResponse {
  result: TorrentList;
}

export interface TorrentList {
  stats: Stats;
  connected: boolean;
  torrents: Record<string, Torrent>;
  filters: TorrentFilters;
}

/**
 * ['label', 'id']
 */
export interface TorrentFilters {
  state: Array<[TorrentState, number]>;
  tracker_host: Array<[string, number]>;
  label?: Array<[string, number]>;
}

export interface Stats {
  upload_protocol_rate: number;
  max_upload: number;
  download_protocol_rate: number;
  download_rate: number;
  has_incoming_connections: boolean;
  num_connections: number;
  max_download: number;
  upload_rate: number;
  dht_nodes: number;
  free_space: number;
  max_num_connections: number;
}

export interface Torrent {
  [key: string]: any;
  super_seeding?: boolean;
  max_download_speed: number;
  upload_payload_rate: number;
  download_payload_rate: number;
  num_peers: number;
  ratio: number;
  total_peers: number;
  state: string;
  max_upload_speed: number;
  eta: number;
  save_path: string;
  comment: string;
  num_files: number;
  total_size: number;
  progress: number;
  time_added: number;
  tracker_host: string;
  tracker: string;
  total_uploaded: number;
  total_done: number;
  total_wanted: number;
  total_seeds: number;
  seeds_peers_ratio: number;
  num_seeds: number;
  name: string;
  is_auto_managed: boolean;
  queue: number;
  distributed_copies: number;
  label?: string;
  max_connections: number,
  max_upload_slots: number,
  stop_at_ratio: boolean,
  stop_ratio: number,
  remove_at_ratio: boolean,
  prioritize_first_last: boolean,
  move_completed: boolean,
  move_completed_path: string,
}

export interface PluginInfo extends DefaultResponse {
  result: {
    Name: string;
    License: string;
    Author: string;
    "Home-page": string;
    Summary: string;
    Platform: string;
    Version: string;
    "Author-email": string;
    Description: string;
  };
}

export interface ConfigResponse extends DefaultResponse {
  result: DelugeSettings;
}

export interface PluginsListResponse extends DefaultResponse {
  result: {
    enabled_plugins: string[];
    available_plugins: string[];
  };
}

export interface Tracker {
  tier: number;
  url: string;
}

export interface TorrentStatus extends DefaultResponse {
  result: Torrent;
}

export interface TorrentPeers {
  down_speed: number;
  ip: string;
  up_speed: number;
  client: string;
  country: string;
  progress: number;
  seed: number;
}

export interface TorrentFiles extends DefaultResponse {
  result: {
    contents: Record<string, Content>;
    type: ContentType;
  };
}

export const torrentOptionsSchema = z.object({
  max_download_speed: z.number(),
  max_upload_speed: z.number(),
  max_connections: z.number(),
  max_upload_slots: z.number(),
  prioritize_first_last: z.boolean(),
  auto_managed: z.boolean(),
  stop_at_ratio: z.boolean(),
  stop_ratio: z.number(),
  remove_at_ratio: z.boolean(),
  move_completed: z.boolean(),
  move_completed_path: z.string(),
  super_seeding: z.boolean(),
});

export type TorrentOptions = z.infer<typeof torrentOptionsSchema>;

export interface ConfigValues {
  add_paused: boolean;
  max_download_speed_per_torrent: number;
  prioritize_first_last_pieces: boolean;
  max_upload_speed_per_torrent: number;
  max_connections_per_torrent: number;
  move_completed_path: string;
  download_location: string;
  compact_allocation?: boolean;
  move_completed: boolean;
  max_upload_slots_per_torrent: number;
  pre_allocate_storage?: boolean;
  sequential_download?: boolean;
  super_seeding?: boolean;
}

// https://github.com/biwin/deluge/blob/1.3-stable/deluge/core/preferencesmanager.py
// export interface DelugeSettings {
//   /**
//    * Yes, please send anonymous statistics.
//    * default: false
//    */
//   send_info?: boolean;
//   /**
//    * how many times info is sent? i dunno
//    * default: 0
//    */
//   info_sent?: number;
//   /**
//    * default: 58846
//    */
//   daemon_port?: number;
//   /**
//    * set True if the server should allow remote connections
//    * default: false
//    */
//   allow_remote?: boolean;
//   /**
//    * default: /Downloads
//    */
//   download_location: string;
//   /**
//    * incoming ports
//    * default: [6881, 6891]
//    */
//   listen_ports: [number, number];
//   /**
//    * overrides listen_ports
//    * default: true
//    */
//   random_port: boolean;
//   /**
//    * default: [0, 0]
//    */
//   outgoing_ports: [number, number];
//   /**
//    * default: true
//    */
//   random_outgoing_ports: boolean;
//   /**
//    * IP address to listen for BitTorrent connections
//    * default: ""
//    */
//   listen_interface: string;
//   /**
//    * enable torrent copy dir
//    * default: false
//    */
//   copy_torrent_file: boolean;
//   /**
//    * Copy of .torrent files to:
//    */
//   torrentfiles_location: string;
//   /**
//    * default: False
//    */
//   del_copy_torrent_file: boolean;
//   plugins_location: string;
//   /**
//    * Prioritize first and last pieces of torrent
//    * default: False
//    */
//   prioritize_first_last_pieces: boolean;
//   /**
//    * default: True
//    */
//   dht: boolean;
//   /**
//    * default: True
//    */
//   upnp: boolean;
//   /**
//    * default: True
//    */
//   natpmp: boolean;
//   /**
//    * default: True
//    */
//   utpex: boolean;
//   /**
//    * default: True
//    */
//   lsd: boolean;
//   /**
//    * default: 1
//    */
//   enc_in_policy: number;
//   /**
//    * default: 1
//    */
//   enc_out_policy: number;
//   /**
//    * default: 2
//    */
//   enc_level: number;
//   /**
//    * default: True
//    */
//   enc_prefer_rc4: boolean;
//   /**
//    * default: 200
//    */
//   max_connections_global: number;
//   /**
//    * default: -1
//    */
//   max_upload_speed: number;
//   /**
//    * default: -1
//    */
//   max_download_speed: number;
//   /**
//    * default: 4
//    */
//   max_upload_slots_global: number;
//   /**
//    * default: 50
//    */
//   max_half_open_connections: number;
//   /**
//    * default: 20
//    */
//   max_connections_per_second: number;
//   /**
//    * default: True
//    */
//   ignore_limits_on_local_network: boolean;
//   /**
//    * default: -1
//    */
//   max_connections_per_torrent: number;
//   /**
//    * default: -1
//    */
//   max_upload_slots_per_torrent: number;
//   /**
//    * default: -1
//    */
//   max_upload_speed_per_torrent: number;
//   /**
//    * default: -1
//    */
//   max_download_speed_per_torrent: number;
//   enabled_plugins: any[];
//   // "autoadd_location": deluge.common.get_default_download_dir(),
//   /**
//    * default: False
//    */
//   autoadd_enable: boolean;
//   /**
//    * default: False
//    */
//   add_paused: boolean;
//   max_active_seeding: 5;
//   max_active_downloading: 3;
//   max_active_limit: 8;
//   /**
//    * default: False
//    */
//   dont_count_slow_torrents: boolean;
//   /**
//    * default: False
//    */
//   queue_new_to_top: boolean;
//   /**
//    * default: False
//    */
//   stop_seed_at_ratio: boolean;
//   /**
//    * default: False
//    */
//   remove_seed_at_ratio: boolean;
//   /**
//    * default: 2
//    */
//   stop_seed_ratio: number;
//   /**
//    * default: 2
//    */
//   share_ratio_limit: number;
//   /**
//    * default: 7
//    */
//   seed_time_ratio_limit: number;
//   /**
//    * default: 180
//    */
//   seed_time_limit: number;
//   /**
//    * default: True
//    */
//   auto_managed: boolean;
//   /**
//    * default: False
//    */
//   move_completed: boolean;
//   move_completed_path: string;
//   /**
//    * default: True
//    */
//   new_release_check: boolean;
//   proxies?: {
//     peer: {
//       type: 0 | 1 | 2 | 3 | 4 | 5;
//       hostname: string;
//       username: string;
//       password: string;
//       port: number;
//     };
//     web_seed: {
//       type: 0 | 1 | 2 | 3 | 4 | 5;
//       hostname: string;
//       username: string;
//       password: string;
//       port: number;
//     };
//     tracker: {
//       type: 0 | 1 | 2 | 3 | 4 | 5;
//       hostname: string;
//       username: string;
//       password: string;
//       port: number;
//     };
//     dht: {
//       type: 0 | 1 | 2 | 3 | 4 | 5;
//       hostname: string;
//       username: string;
//       password: string;
//       port: number;
//     };
//   };
//   /**
//    * Peer TOS Byte
//    * default: '0x00'
//    */
//   peer_tos?: string;
//   /**
//    * Rate limit IP overhead
//    * default: true
//    */
//   rate_limit_ip_overhead: boolean;
//   /**
//    * default: '/usr/share/GeoIP/GeoIP.dat'
//    */
//   geoip_db_location: string;
//   /**
//    * default: 512
//    */
//   cache_size: number;
//   /**
//    * default: 60
//    */
//   cache_expiry: number;
// }



export const delugeSettingsSchema = z.object({
  /**
   * Yes, please send anonymous statistics.
   * default: false
   */
  send_info: z.boolean().optional(),
  /**
   * how many times info is sent? i dunno
   * default: 0
   */
  info_sent: z.number().optional(),
  /**
   * default: 58846
   */
  daemon_port: z.number().optional(),
  /**
   * set True if the server should allow remote connections
   * default: false
   */
  allow_remote: z.boolean().optional(),
  /**
   * default: /Downloads
   */
  download_location: z.string(),
  /**
   * incoming ports
   * default: [6881, 6891]
   */
  listen_ports: z.tuple([z.number(), z.number()]),
  /**
   * overrides listen_ports
   * default: true
   */
  random_port: z.boolean(),
  /**
   * default: [0, 0]
   */
  outgoing_ports: z.tuple([z.number(), z.number()]),
  /**
   * default: true
   */
  random_outgoing_ports: z.boolean(),
  /**
   * IP address to listen for BitTorrent connections
   * default: ""
   */
  listen_interface: z.string(),
  /**
   * enable torrent copy dir
   * default: false
   */
  copy_torrent_file: z.boolean(),
  /**
   * Copy of .torrent files to:
   */
  torrentfiles_location: z.string(),
  /**
   * default: False
   */
  del_copy_torrent_file: z.boolean(),
  plugins_location: z.string(),
  /**
   * Prioritize first and last pieces of torrent
   * default: False
   */
  prioritize_first_last_pieces: z.boolean(),
  /**
   * default: True
   */
  dht: z.boolean(),
  /**
   * default: True
   */
  upnp: z.boolean(),
  /**
   * default: True
   */
  natpmp: z.boolean(),
  /**
   * default: True
   */
  utpex: z.boolean(),
  /**
   * default: True
   */
  lsd: z.boolean(),
  /**
   * default: 1
   */
  enc_in_policy: z.number(),
  /**
   * default: 1
   */
  enc_out_policy: z.number(),
  /**
   * default: 2
   */
  enc_level: z.number(),
  /**
   * default: True
   */
  enc_prefer_rc4: z.boolean(),
  /**
   * default: 200
   */
  max_connections_global: z.number(),
  /**
   * default: -1
   */
  max_upload_speed: z.number(),
  /**
   * default: -1
   */
  max_download_speed: z.number(),
  /**
   * default: 4
   */
  max_upload_slots_global: z.number(),
  /**
   * default: 50
   */
  max_half_open_connections: z.number(),
  /**
   * default: 20
   */
  max_connections_per_second: z.number(),
  /**
   * default: True
   */
  ignore_limits_on_local_network: z.boolean(),
  /**
   * default: -1
   */
  max_connections_per_torrent: z.number(),
  /**
   * default: -1
   */
  max_upload_slots_per_torrent: z.number(),
  /**
   * default: -1
   */
  max_upload_speed_per_torrent: z.number(),
  /**
   * default: -1
   */
  max_download_speed_per_torrent: z.number(),
  enabled_plugins: z.array(z.any()),
  // "autoadd_location": deluge.common.get_default_download_dir(),
  /**
   * default: False
   */
  autoadd_enable: z.boolean(),
  /**
   * default: False
   */
  add_paused: z.boolean(),
  max_active_seeding: z.number(),
  max_active_downloading: z.number(),
  max_active_limit: z.number(),
  /**
   * default: False
   */
  dont_count_slow_torrents: z.boolean(),
  /**
   * default: False
   */
  queue_new_to_top: z.boolean(),
  /**
   * default: False
   */
  stop_seed_at_ratio: z.boolean(),
  /**
   * default: False
   */
  remove_seed_at_ratio: z.boolean(),
  /**
   * default: 2
   */
  stop_seed_ratio: z.number(),
  /**
   * default: 2
   */
  share_ratio_limit: z.number(),
  /**
   * default: 7
   */
  seed_time_ratio_limit: z.number(),
  /**
   * default: 180
   */
  seed_time_limit: z.number(),
  /**
   * default: True
   */
  auto_managed: z.boolean(),
  /**
   * default: False
   */
  move_completed: z.boolean(),
  move_completed_path: z.string(),
  /**
   * default: True
   */
  new_release_check: z.boolean(),
  proxies: z
    .object({
      peer: z.object({
        type: z.union([
          z.literal(0),
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5)
        ]),
        hostname: z.string(),
        username: z.string(),
        password: z.string(),
        port: z.number()
      }),
      web_seed: z.object({
        type: z.union([
          z.literal(0),
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5)
        ]),
        hostname: z.string(),
        username: z.string(),
        password: z.string(),
        port: z.number()
      }),
      tracker: z.object({
        type: z.union([
          z.literal(0),
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5)
        ]),
        hostname: z.string(),
        username: z.string(),
        password: z.string(),
        port: z.number()
      }),
      dht: z.object({
        type: z.union([
          z.literal(0),
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5)
        ]),
        hostname: z.string(),
        username: z.string(),
        password: z.string(),
        port: z.number()
      })
    })
    .optional(),
  /**
   * Peer TOS Byte
   * default: '0x00'
   */
  peer_tos: z.string().optional(),
  /**
   * Rate limit IP overhead
   * default: true
   */
  rate_limit_ip_overhead: z.boolean(),
  /**
   * default: '/usr/share/GeoIP/GeoIP.dat'
   */
  geoip_db_location: z.string(),
  /**
   * default: 512
   */
  cache_size: z.number(),
  /**
   * default: 60
   */
  cache_expiry: z.number()
})

export type DelugeSettings = z.infer<typeof delugeSettingsSchema>


export interface TorrentSettings {
  /**
   * ex - `http://localhost:4444/
   */
  baseUrl: string;
  /**
   * ex - `'/json'`
   */
  path: string;
  username?: string;
  password?: string;
  /**
   * pass http agent for proxy
   * @link https://github.com/sindresorhus/got#proxies
   */
  agent?: Agents;
  /**
   * request timeout
   * @link https://github.com/sindresorhus/got#timeout
   */
  timeout?: number;
}
export enum TorrentState {
  downloading = "downloading",
  seeding = "seeding",
  paused = "paused",
  queued = "queued",
  checking = "checking",
  warning = "warning",
  error = "error",
  unknown = "unknown",
}
export interface Label {
  id: string;
  name: string;
  count: number;
}
export interface NormalizedTorrent {
  /**
   * torrent hash id
   */
  id: string;
  /**
   * torrent name
   */
  name: string;
  /**
   * progress percent out of 100
   */
  progress: number;
  isCompleted: boolean;
  /**
   * 1:1 is 1, half seeded is 0.5
   */
  ratio: number;
  /**
   * date as iso string
   */
  dateAdded: string;
  /**
   * date completed as iso string;
   */
  dateCompleted: string | null;
  savePath: string;
  /**
   * Sometimes called "Category", other times called label
   */
  label: string | null;
  /**
   * Note that this is different from label
   */
  tags: string[] | null;
  state: TorrentState;
  stateMessage: string;
  /**
   * bytes per second
   */
  uploadSpeed: number;
  /**
   * bytes per second
   */
  downloadSpeed: number;
  /**
   * seconds until finish
   */
  eta: number;
  queuePosition: number;
  connectedSeeds: number;
  connectedPeers: number;
  totalSeeds: number;
  totalPeers: number;
  /**
   * size of files to download in bytes
   */
  totalSelected: number;
  /**
   * total size of the torrent, in bytes
   */
  totalSize: number;
  /**
   * total upload in bytes
   */
  totalUploaded: number;
  /**
   * total download in bytes
   */
  totalDownloaded: number;
  /**
   * Raw data returned by client
   */
  raw: any | null;
}
export interface AllClientData {
  labels: Label[];
  torrents: NormalizedTorrent[];
  state: Array<[TorrentState, number]>;
  /**
   * Raw data returned by client
   */
  raw: TorrentListResponse;
}
