import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import delugeClient from "../deluge";
import {
  AddTorrentOptions,
  delugeSettingsSchema,
  GetHostStatusResponse,
  TorrentOptions,
  torrentOptionsSchema,
} from "../../deluge";
import { removeNullUndefined } from "../../utils/helper";

export const deluge = router({
  allData: protectedProcedure.query(async () => {
    const allTorrents = await delugeClient.getAllData();
    return allTorrents;
  }),
  pause: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const paused = await delugeClient.pauseTorrent(input.id);
      return paused;
    }),
  resume: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const resumed = await delugeClient.resumeTorrent(input.id);
      return resumed;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        removeData: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const resumed = await delugeClient.removeTorrent(
        input.id,
        input.removeData
      );
      return resumed;
    }),

  configValue: protectedProcedure
    .input(
      z.object({
        v2: z.boolean(),
      })
    )
    .query(async ({ input, ctx }) => {
      const config = await delugeClient.getConfigValues(input.v2);
      return config;
    }),

  magnetInfo: protectedProcedure
    .input(
      z.object({
        magnet: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const magnetInfo = await delugeClient.getMagnetInfo(input.magnet);
      if (magnetInfo) {
        return magnetInfo;
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid Magnet URL",
      });
    }),

  addMagnet: protectedProcedure
    .input(
      z.object({
        magnet: z.string(),
        config: z.object({
          add_paused: z.boolean(),
          compact_allocation: z.boolean().nullish(),
          download_location: z.string(),
          max_connections_per_torrent: z.number().min(-1),
          max_download_speed_per_torrent: z.number().min(-1),
          max_upload_slots_per_torrent: z.number().min(-1),
          max_upload_speed_per_torrent: z.number().min(-1),
          move_completed: z.boolean(),
          move_completed_path: z.string(),
          prioritize_first_last_pieces: z.boolean(),
          pre_allocate_storage: z.boolean().nullish(),
          sequential_download: z.boolean().nullish(),
          super_seeding: z.boolean().nullish(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const config: Partial<AddTorrentOptions> = {
        file_priorities: [],
        max_connections: input.config.max_connections_per_torrent,
        add_paused: input.config.add_paused,
        compact_allocation: input.config.compact_allocation ?? undefined,
        download_location: input.config.download_location,
        max_download_speed: input.config.max_download_speed_per_torrent,
        max_upload_slots: input.config.max_upload_slots_per_torrent,
        max_upload_speed: input.config.max_upload_speed_per_torrent,
        move_completed: input.config.move_completed,
        move_completed_path: input.config.move_completed_path,
        prioritize_first_last_pieces: input.config.prioritize_first_last_pieces,
        pre_allocate_storage: input.config.pre_allocate_storage ?? undefined,
        super_seeding: input.config.super_seeding ?? undefined,
        sequential_download: input.config.sequential_download ?? undefined,
      };
      console.log(config);

      const notNullconfig = removeNullUndefined(
        config
      ) as Partial<AddTorrentOptions>;
      console.log(notNullconfig);

      const added = await delugeClient.addTorrentMagnet(
        input.magnet,
        notNullconfig
      );
      return added;
    }),

  getFiles: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const magnetInfo = await delugeClient.getTorrentFiles(input.id);
      return magnetInfo;
    }),

  getInfo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const torrent = await delugeClient.getTorrent(input.id);
      return torrent;
    }),
  setFilePriority: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        priority: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.setFilePriority(input.id, input.priority);
      return res;
    }),

  setLabel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.setTorrentLabel(input.id, input.label);
      return res;
    }),

  addLabel: protectedProcedure
    .input(
      z.object({
        label: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.addLabel(input.label);
      return res;
    }),

  queueTop: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.queueTop(input.id);
      return res;
    }),

  queueBottom: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.queueBottom(input.id);
      return res;
    }),

  queueUp: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.queueUp(input.id);
      return res;
    }),

  queueDown: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.queueDown(input.id);
      return res;
    }),

  forceRecheck: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const res = await delugeClient.verifyTorrent(input.id);
      return res;
    }),

  getHostInfo: protectedProcedure.mutation(async () => {
    let id = delugeClient.getHostId();
    if (!id) {
      await delugeClient.connect();
      id = delugeClient.getHostId();
    }
    const status = await delugeClient.getHostStatus(id!);
    const res = status.result.pop() as string;
    return res;
  }),

  setTorrentOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: torrentOptionsSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await delugeClient.setTorrentOptions(input.id, input.data);
      return res;
    }),

  getTorrentOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const res = await delugeClient.getTorrentStatus(input.id);
      return res;
    }),

  setGlobalConfig: protectedProcedure.input(z.object({
    data: delugeSettingsSchema.partial()
  })).mutation(async ({input}) => {
    const res = await delugeClient.setConfig(input.data);
    return res;
  })
});
