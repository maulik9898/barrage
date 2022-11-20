import { existsSync } from "fs";

import { File, FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import type { Response } from "got";
import got from "./got";
import { Cookie, CookieJar } from "tough-cookie";

import { magnetDecode } from "@ctrl/magnet-link";

import { urlJoin } from "@ctrl/url-join";

import {
  AddTorrentOptions,
  AddTorrentResponse,
  AllClientData,
  BooleanStatus,
  ConfigResponse,
  ConfigValues,
  DefaultResponse,
  DelugeSettings,
  GetHostsResponse,
  GetHostStatusResponse,
  ListMethods,
  NormalizedTorrent,
  PluginInfo,
  PluginsListResponse,
  StringStatus,
  Torrent,
  TorrentFiles,
  TorrentInfo,
  TorrentInfoResult,
  TorrentListResponse,
  TorrentOptions,
  TorrentSettings,
  TorrentState,
  TorrentStatus,
  Tracker,
  UploadResponse,
} from "./types";

const defaults: TorrentSettings = {
  baseUrl: "http://localhost:8112/",
  path: "/json",
  password: "deluge",
  timeout: 5000,
};

export class Deluge {
  config: TorrentSettings;

  private _msgId = 0;
  private _hostId?: string;

  private _cookie?: Cookie;

  constructor(options: Partial<TorrentSettings> = {}) {
    this.config = { ...defaults, ...options };
  }
  resetSession(): void {
    this._cookie = undefined;
    this._msgId = 0;
  }

  getHostId() {
    return this._hostId;
  }

  async getHosts(): Promise<GetHostsResponse> {
    const res = await this.request<GetHostsResponse>(
      "web.get_hosts",
      [],
      true,
      false
    );
    return res.body;
  }

  /**
   * Gets host status
   * @param host pass host id from `this.getHosts()`
   */
  async getHostStatus(host: string): Promise<GetHostStatusResponse> {
    const res = await this.request<GetHostStatusResponse>(
      "web.get_host_status",
      [host],
      true,
      false
    );
    return res.body;
  }

  /**
   * Connects deluge and returns a list of available methods
   * @param host index of host to use in result of get hosts
   * @param hostIdx index of host to use in result of get hosts
   */
  async connect(selectedHost?: string, hostIdx = 0): Promise<ListMethods> {
    let host = selectedHost;
    if (!host) {
      const hosts = await this.getHosts();
      host = hosts.result[hostIdx][0];
    }

    if (!host) {
      throw new Error("No hosts found");
    }
    this._hostId = host;

    const res = await this.request<ListMethods>(
      "web.connect",
      [host],
      true,
      false
    );
    return res.body;
  }

  async connected(): Promise<boolean> {
    const res = await this.request<BooleanStatus>(
      "web.connected",
      [],
      true,
      false
    );
    return res.body.result;
  }

  /**
   * Disconnects deluge - warning all instances connected to this client will also be disconnected.
   * Other instances may also reconnect. Not really sure why you would want to disconnect
   */
  async disconnect(): Promise<boolean> {
    const res = await this.request<StringStatus>(
      "web.disconnect",
      [],
      true,
      false
    );
    // deluge 1.x returns a boolean and 2.x returns a string
    if (typeof res.body.result === "boolean") {
      return res.body.result;
    }

    // "Connection was closed cleanly."
    return res.body.result.includes("closed cleanly");
  }

  /**
   * Checks current session is valid
   * @returns true if valid
   */
  async checkSession(): Promise<boolean> {
    // cookie is missing or expires in x seconds
    if (this._cookie) {
      // eslint-disable-next-line new-cap
      if (this._cookie.TTL() < 5000) {
        this.resetSession();
        return false;
      }

      return true;
    }
    if (this._cookie) {
      try {
        const check = await this.request<BooleanStatus>(
          "auth.check_session",
          undefined,
          false
        );
        if (check?.body?.result) {
          return true;
        }
      } catch {
        // do nothing
      }
    }

    this.resetSession();
    return false;
  }

  /**
   * Login deluge
   * @returns true if success
   */
  async login(): Promise<boolean> {
    this.resetSession();
    const res = await this.request<BooleanStatus>(
      "auth.login",
      [this.config.password],
      false,
      false
    );
    if (!res.body.result || !res.headers || !res.headers["set-cookie"]) {
      throw new Error("Auth failed, incorrect password");
    }

    this._cookie = Cookie.parse(res.headers["set-cookie"][0]);
    return true;
  }

  /**
   * Logout deluge
   * @returns true if success
   */
  async logout(): Promise<boolean> {
    const res = await this.request<BooleanStatus>("auth.delete_session");
    this.resetSession();
    return res.body.result;
  }

  /**
   * returns the version ex - `2.0.3-2-201906121747-ubuntu18.04.1`
   */
  async getVersion(): Promise<StringStatus> {
    let req;
    try {
      req = await this.request<StringStatus>("daemon.get_version");
    } catch (error) {
      req = await this.request<StringStatus>("daemon.info");
    }

    return req.body;
  }

  /**
   * used to get torrent info before adding
   * @param tmpPath use path returned from upload torrent looks like `'/tmp/delugeweb-DfEsgR/tmpD3rujY.torrent'`
   */
  async getTorrentInfo(tmpPath: string): Promise<TorrentInfo> {
    const res = await this.request<TorrentInfo>("web.get_torrent_info", [
      tmpPath,
    ]);
    return res.body;
  }

  async setFilePriority(
    id: string,
    priorities: number[]
  ): Promise<DefaultResponse> {
    const res = await this.request<DefaultResponse>(
      "core.set_torrent_file_priorities",
      [id, priorities]
    );
    return res.body;
  }

  /**
   * Lists methods
   * @param auth disable or enable auth connection
   * @returns a list of method names
   */
  async listMethods(auth = true): Promise<ListMethods> {
    const req = await this.request<ListMethods>(
      "system.listMethods",
      undefined,
      auth
    );
    return req.body;
  }

  async upload(torrent: string | Buffer): Promise<UploadResponse> {
    await this._validateAuth();
    const isConnected = await this.connected();
    if (!isConnected) {
      await this.connect();
    }

    const form = new FormData();
    const type = { type: "application/x-bittorrent" };
    if (typeof torrent === "string") {
      if (existsSync(torrent)) {
        const file = await fileFromPath(torrent, "temp.torrent", type);
        form.set("file", file);
      } else {
        form.set(
          "file",
          new File([Buffer.from(torrent, "base64")], "file.torrent", type)
        );
      }
    } else {
      const file = new File([torrent], "torrent", type);
      form.set("file", file);
    }

    const url = urlJoin(this.config.baseUrl, "/upload");
    const res = await got.post(url, {
      body: form,
      retry: { limit: 0 },
      timeout: { request: this.config.timeout },
      // allow proxy agent
      ...(this.config.agent ? { agent: this.config.agent } : {}),
    });

    // repsonse is json but in a string, cannot use native got.json()
    return JSON.parse(res.body) as UploadResponse;
  }

  /**
   * Download a torrent from url, pass the result to {@link Deluge.addTorrent}
   * @param url
   * @param cookies
   * @returns file path
   */
  async downloadFromUrl(url: string, cookies = ""): Promise<string> {
    const res = await this.request<StringStatus>(
      "web.download_torrent_from_url",
      [url, cookies]
    );

    if (!res.body.result) {
      throw new Error("Failed to download torrent");
    }

    return res.body.result;
  }

  async addTorrentMagnet(
    magnet: string,
    config: Partial<AddTorrentOptions>
  ): Promise<AddTorrentResponse> {
    const options = {
      //move_completed_path: "/home/ultra/downloads/deluge",
      ...config,
    };
    console.log(options);
    const res = await this.request<AddTorrentResponse>("web.add_torrents", [
      [{ path: magnet, options: options }],
    ]);

    if (!res.body.result) {
      throw new Error("Failed to add torrent");
    }

    return res.body;
  }

  async addTorrent(
    torrent: string | Buffer,
    config: Partial<AddTorrentOptions> = {}
  ): Promise<AddTorrentResponse> {
    let path: string;
    if (Buffer.isBuffer(torrent) || !torrent.startsWith("/tmp/")) {
      const upload = await this.upload(torrent);
      if (!upload.success || !upload.files.length) {
        throw new Error("Failed to upload");
      }

      path = upload.files[0];
    } else {
      /** Assume paths starting with /tmp/ are from {@link Deluge.addTorrent} */
      path = torrent;
    }

    const options = {
      ...config,
    };
    const res = await this.request<AddTorrentResponse>("web.add_torrents", [
      [{ path, options }],
    ]);

    if (!res.body.result) {
      throw new Error("Failed to add torrent");
    }

    return res.body;
  }

  async normalizedAddTorrent(
    torrent: string | Buffer,
    options: Partial<ConfigValues> = {}
  ): Promise<NormalizedTorrent> {
    const torrentOptions: Partial<ConfigValues> = {};
    if (options.add_paused) {
      torrentOptions.add_paused = true;
    }

    let torrentHash: string | undefined;
    if (typeof torrent === "string" && torrent.startsWith("magnet:")) {
      torrentHash = magnetDecode(torrent).infoHash;
      if (!torrentHash) {
        throw new Error("Magnet did not contain hash");
      }

      await this.addTorrentMagnet(torrent, torrentOptions);
    } else {
      if (!Buffer.isBuffer(torrent)) {
        torrent = Buffer.from(torrent);
      }

      const res = await this.addTorrent(torrent, torrentOptions);
      torrentHash = res.result[0][1];
    }

    return this.getTorrent(torrentHash);
  }
  async getConfigValues(v2: boolean): Promise<ConfigValues> {
    const fieldsv1 = [
      "add_paused",
      "compact_allocation",
      "download_location",
      "max_connections_per_torrent",
      "max_download_speed_per_torrent",
      "move_completed",
      "move_completed_path",
      "max_upload_slots_per_torrent",
      "max_upload_speed_per_torrent",
      "prioritize_first_last_pieces",
    ];

    const fieldsv2 = [
      "add_paused",
      "pre_allocate_storage",
      "download_location",
      "max_connections_per_torrent",
      "max_download_speed_per_torrent",
      "move_completed",
      "move_completed_path",
      "max_upload_slots_per_torrent",
      "max_upload_speed_per_torrent",
      "prioritize_first_last_pieces",
      "sequential_download",
      "super_seeding",
    ];

    const req = await this.request<{ result: ConfigValues }>(
      "core.get_config_values",
      [[...new Set(v2 ? fieldsv2 : fieldsv1)]],
      true,
      false
    );
    return req.body.result;
  }

  /**
   *
   * @param torrentId torrent id from list torrents
   * @param removeData true will delete all data from disk
   */
  async removeTorrent(
    torrentId: string,
    removeData = true
  ): Promise<BooleanStatus> {
    const req = await this.request<BooleanStatus>("core.remove_torrent", [
      torrentId,
      removeData,
    ]);
    return req.body;
  }

  async changePassword(password: string): Promise<BooleanStatus> {
    const res = await this.request<BooleanStatus>("auth.change_password", [
      this.config.password,
      password,
    ]);
    if (!res.body.result || !res.headers || !res.headers["set-cookie"]) {
      throw new Error("Old password incorrect");
    }

    // update current password to new password
    this.config.password = password;
    this._cookie = Cookie.parse(res.headers["set-cookie"][0]);
    return res.body;
  }

  async getAllData(runagain = true): Promise<AllClientData> {
    const listTorrents = await this.listTorrents();
    const results: AllClientData = {
      torrents: [],
      labels: [],
      state: [],
      raw: listTorrents,
    };

    for (const id of Object.keys(listTorrents.result.torrents)) {
      try {
        const torrent = listTorrents.result.torrents[id];
        const torrentData: NormalizedTorrent = this._normalizeTorrentData(
          id,
          torrent
        );
        results.torrents.push(torrentData);
      } catch (error) {
        console.log(error);
        await this.disconnect();
        await this.connect();
        if (runagain) {
          console.log("running again");
          return await this.getAllData(false);
        }
      }
    }

    if (listTorrents.result.filters.label) {
      for (const label of listTorrents.result.filters.label) {
        results.labels.push({
          id: label[0],
          name: label[0],
          count: label[1],
        });
      }
    }
    if (listTorrents.result.filters.state) {
      for (const state of listTorrents.result.filters.state) {
        if (Object.keys(TorrentState).includes(state[0].toLowerCase())) {
          results.state.push([
            state[0].toLowerCase() as TorrentState,
            state[1],
          ]);
        }
      }
    }

    return results;
  }

  async listTorrents(
    additionalFields: string[] = [],
    filter: Record<string, string> = {}
  ): Promise<TorrentListResponse> {
    const fields = [
      "distributed_copies",
      "download_payload_rate",
      "eta",
      "is_auto_managed",
      "max_download_speed",
      "max_upload_speed",
      "name",
      "num_peers",
      "num_seeds",
      "progress",
      "queue",
      "ratio",
      "save_path",
      "seeds_peers_ratio",
      "state",
      "time_added",
      "total_done",
      "total_peers",
      "total_seeds",
      "total_uploaded",
      "total_wanted",
      "tracker_host",
      "upload_payload_rate",
      // if they don't have the label plugin it shouldn't fail
      "label",
      ...additionalFields,
    ];
    const req = await this.request<TorrentListResponse>("web.update_ui", [
      [...new Set(fields)],
      filter,
    ]);
    return req.body;
  }

  async getTorrent(id: string): Promise<NormalizedTorrent> {
    const torrentResponse = await this.getTorrentStatus(id);
    return this._normalizeTorrentData(id, torrentResponse.result);
  }

  /**
   * get torrent state/status
   * @param additionalFields fields ex - `['label']`
   */
  async getTorrentStatus(
    torrentId: string,
    additionalFields: string[] = []
  ): Promise<TorrentStatus> {
    const fields = [
      "total_done",
      "total_payload_download",
      "total_uploaded",
      "total_payload_upload",
      "next_announce",
      "tracker_status",
      "tracker",
      "comment",
      "num_pieces",
      "piece_length",
      "is_auto_managed",
      "active_time",
      "seeding_time",
      "seed_rank",
      "queue",
      "name",
      "total_wanted",
      "state",
      "progress",
      "num_seeds",
      "total_seeds",
      "num_peers",
      "total_peers",
      "download_payload_rate",
      "upload_payload_rate",
      "eta",
      "ratio",
      "distributed_copies",
      "is_auto_managed",
      "time_added",
      "tracker_host",
      "save_path",
      "total_size",
      "num_files",
      "total_done",
      "total_uploaded",
      "max_download_speed",
      "max_upload_speed",
      "seeds_peers_ratio",
      "label",
      "max_connections",
      "max_upload_slots",
      "stop_at_ratio",
      "stop_ratio",
      "remove_at_ratio",
      "private",
      "prioritize_first_last",
      "move_completed",
      "move_completed_path",
      ...additionalFields,
    ];
    const req = await this.request<TorrentStatus>("web.get_torrent_status", [
      torrentId,
      fields,
    ]);
    if (!req.body.result || !Object.keys(req.body.result).length) {
      throw new Error("Torrent not found");
    }

    return req.body;
  }

  /**
   * Get list of files for a torrent
   */
  async getTorrentFiles(torrentId: string): Promise<TorrentFiles> {
    const req = await this.request<TorrentFiles>("web.get_torrent_files", [
      torrentId,
    ]);
    return req.body;
  }

  async pauseTorrent(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.pause_torrent", [
      [torrentId],
    ]);
    return req.body;
  }

  async resumeTorrent(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.resume_torrent", [
      [torrentId],
    ]);
    return req.body;
  }

  async setTorrentOptions(
    torrentId: string,
    options: Partial<TorrentOptions> = {}
  ): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>(
      "core.set_torrent_options",
      [[torrentId], options]
    );
    return req.body;
  }

  async setTorrentTrackers(
    torrentId: string,
    trackers: Tracker[] = []
  ): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>(
      "core.set_torrent_trackers",
      [[torrentId], trackers]
    );
    return req.body;
  }

  async updateTorrentTrackers(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.force_reannounce", [
      [torrentId],
    ]);
    return req.body;
  }

  async verifyTorrent(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.force_recheck", [
      [torrentId],
    ]);
    return req.body;
  }

  async getMagnetInfo(magnet: string): Promise<TorrentInfoResult> {
    const req = await this.request<TorrentInfo>("web.get_magnet_info", [
      magnet,
    ]);
    return req.body.result;
  }

  async setTorrentLabel(
    torrentId: string,
    label: string
  ): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("label.set_torrent", [
      torrentId,
      label,
    ]);
    return req.body;
  }

  async addLabel(label: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("label.add", [label]);
    return req.body;
  }

  async removeLabel(label: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("label.remove", [label]);
    return req.body;
  }

  async getLabels(): Promise<ListMethods> {
    const req = await this.request<ListMethods>("label.get_labels", []);
    return req.body;
  }

  async queueTop(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.queue_top", [
      [torrentId],
    ]);
    return req.body;
  }

  async queueBottom(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.queue_bottom", [
      [torrentId],
    ]);
    return req.body;
  }

  async queueUp(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.queue_up", [
      [torrentId],
    ]);
    return req.body;
  }

  async queueDown(torrentId: string): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.queue_down", [
      [torrentId],
    ]);
    return req.body;
  }

  async getConfig(): Promise<ConfigResponse> {
    const req = await this.request<ConfigResponse>("core.get_config", []);
    return req.body;
  }

  async setConfig(config: Partial<DelugeSettings>): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>("core.set_config", [
      config,
    ]);
    return req.body;
  }

  async getPlugins(): Promise<PluginsListResponse> {
    const req = await this.request<PluginsListResponse>("web.get_plugins", []);
    return req.body;
  }

  async getPluginInfo(plugins: string[]): Promise<PluginInfo> {
    const req = await this.request<PluginInfo>("web.get_plugin_info", plugins);
    return req.body;
  }

  async enablePlugin(plugins: string[]): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>(
      "core.enable_plugin",
      plugins
    );
    return req.body;
  }

  async disablePlugin(plugins: string[]): Promise<DefaultResponse> {
    const req = await this.request<DefaultResponse>(
      "core.disable_plugin",
      plugins
    );
    return req.body;
  }

  async request<T extends object>(
    method: string,
    params: any[] = [],
    needsAuth = true,
    autoConnect = true
  ): Promise<Response<T>> {
    if (this._msgId === 4096) {
      this._msgId = 0;
    }

    if (needsAuth) {
      await this._validateAuth();
    }

    const headers: any = {
      Cookie: this._cookie?.cookieString?.(),
    };
    const url = urlJoin(this.config.baseUrl, this.config.path);
    const res: Response<T> = await got.post(url, {
      json: {
        method,
        params,
        id: this._msgId++,
      },
      headers,
      retry: { limit: 0 },
      timeout: { request: this.config.timeout },
      responseType: "json",
      // allow proxy agent
      ...(this.config.agent ? { agent: this.config.agent } : {}),
    });

    const isConnected = (res.body as any)?.result?.connected;
    console.log(isConnected === false && autoConnect);

    if (isConnected === false && autoConnect) {
      await this.connect();
      return await this.request<T>(method, params, needsAuth, false);
    }

    const err =
      (res.body as { error: unknown })?.error ??
      (typeof res.body === "string" && res.body);

    if (err) {
      throw new Error((err as Error).message || (err as string));
    }

    return res;
  }

  private _normalizeTorrentData(
    id: string,
    torrent: Torrent
  ): NormalizedTorrent {
    let dateAdded;
    dateAdded = new Date(torrent.time_added * 1000).toISOString();

    // normalize state to enum
    let state = TorrentState.unknown;
    if (Object.keys(TorrentState).includes(torrent.state.toLowerCase())) {
      state =
        TorrentState[torrent.state.toLowerCase() as keyof typeof TorrentState];
    }

    const isCompleted = torrent.progress >= 100;

    const result: NormalizedTorrent = {
      id,
      name: torrent.name,
      state,
      isCompleted,
      stateMessage: torrent.state,
      progress: torrent.progress / 100,
      ratio: torrent.ratio,
      dateAdded,
      dateCompleted: "",
      label: torrent.label!,
      savePath: torrent.save_path,
      uploadSpeed: torrent.upload_payload_rate,
      downloadSpeed: torrent.download_payload_rate,
      eta: torrent.eta,
      queuePosition: torrent.queue + 1,
      connectedPeers: torrent.num_peers,
      connectedSeeds: torrent.num_seeds,
      totalPeers: torrent.total_peers,
      totalSeeds: torrent.total_seeds,
      totalSelected: torrent.total_wanted,
      totalSize: (torrent.total_done / torrent.progress) * 100,
      totalUploaded: torrent.total_uploaded,
      totalDownloaded: torrent.total_done,
      raw: torrent,
      tags: null,
    };
    return result;
  }

  private async _validateAuth(): Promise<void> {
    let validAuth = await this.checkSession();
    if (!validAuth) {
      validAuth = await this.login();
    }

    if (!validAuth) {
      throw new Error("Invalid Auth");
    }
  }
}
