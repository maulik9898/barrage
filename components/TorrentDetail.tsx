import { Card, Grid, Text } from "@mantine/core";
import React from "react";
import { humanFileSize } from "../utils/helper";
import { trpc } from "../utils/trpc";
import DetailGridCol from "./DetailGridCol";
import DetailLoader from "./DetailLoader";

const TorrentDetail = ({ id }: { id: string }) => {
  const torrent = trpc.deluge.getInfo.useQuery(
    { id: id },
    {
      refetchInterval: 3000,
    }
  );
  if (torrent.isLoading) {
    ``;
    return <DetailLoader />;
  }
  return (
    <Card mb={'sm'} shadow={"sm"} radius={"sm"} mt={0} m={"md"} withBorder bg={"dark.9"}>
      {torrent.data && (
        <Grid gutter={"md"} justify={"flex-start"}>
          <DetailGridCol label={"Name"} value={torrent.data.name} />
          <DetailGridCol label="Path" value={torrent.data.savePath} />

          <DetailGridCol label="Status" value={torrent.data.stateMessage} />
          { torrent.data.label && <DetailGridCol label="Label" value={torrent.data.label || ''} />}

          <DetailGridCol
            label="Date Added"
            value={new Date(torrent.data.dateAdded).toString()}
          />
          <DetailGridCol
            label="Size"
            value={humanFileSize(torrent.data.totalSize)}
          />
          <DetailGridCol
            label="Downloaded"
            value={humanFileSize(torrent.data.totalDownloaded)}
          />
          <DetailGridCol
            label="Uploaded"
            value={humanFileSize(torrent.data.totalUploaded)}
          />
          <DetailGridCol
            label="Share Ratio"
            value={torrent.data.ratio.toPrecision(3)}
          />
          <DetailGridCol
            label="Peers"
            value={`${torrent.data.connectedPeers} (${torrent.data.totalPeers})`}
          />
          <DetailGridCol
            label="Seeders"
            value={`${torrent.data.connectedSeeds} (${torrent.data.totalSeeds})`}
          />
          <DetailGridCol
            label="Avaibility"
            value={`${torrent.data.raw["distributed_copies"]?.toPrecision(3)}`}
          />
          <DetailGridCol
            label="Seed Rank"
            value={`${torrent.data.raw["seed_rank"]?.toPrecision(3)}`}
          />
          <DetailGridCol
            label="Pieces"
            value={`${torrent.data.raw["num_pieces"]} (${humanFileSize(
              torrent.data.raw["piece_length"]
            )})`}
          />
        </Grid>
      )}
    </Card>
  );
};

export default TorrentDetail;
