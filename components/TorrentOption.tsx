import {
  Button,
  Card,
  Center,
  Checkbox,
  Flex,
  Grid,
  Group,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTimeout } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { ConfigValues, Torrent, TorrentOptions } from "../deluge";
import useTorrentStore from "../stores/useTorrentStore";
import { trpc } from "../utils/trpc";
import TorrentOptionForm from "./TorrentOptionForm";

const v1op = [
  "max_download_speed",
  "max_upload_speed",
  "max_connections",
  "max_upload_slots",
  "is_auto_managed",
  "stop_at_ratio",
  "stop_ratio",
  "remove_at_ratio",

  "prioritize_first_last",
  "move_completed",
  "move_completed_path",
];

const v2op = [
  "max_download_speed",
  "max_upload_speed",
  "max_connections",
  "max_upload_slots",
  "is_auto_managed",
  "stop_at_ratio",
  "stop_ratio",
  "remove_at_ratio",
  "private",
  "prioritize_first_last",
  "move_completed",
  "move_completed_path",
  "super_seeding",
];

const findDiff = (old: Partial<Torrent>, current: Partial<Torrent>) => {
  let diff: any = {};
  for (const [key, value] of Object.entries(current)) {
    if (key === "stop_ratio" || key === "remove_at_ratio") {
      if (!current.stop_at_ratio) {
        continue;
      }
    }

    if (key === "move_completed_path") {
      if (!current.move_completed) {
        continue;
      }
    }

    if (old[key] !== value) {
      if (key === "is_auto_managed") {
        diff["auto_managed"] = value;
      } else {
        diff[key] = value;
      }
    }
  }

  return diff;
};

const TorrentOption = ({ id }: { id: string }) => {
  const v2 = useTorrentStore((s) => s.isv2);
  const [loading, setLoading] = useState(false);
  const { start, clear } = useTimeout(() => options.refetch(), 800);

  const form = useForm({
    initialValues: {
      max_download_speed: -1,
      max_upload_speed: -1,
      max_connections: -1,
      max_upload_slots: -1,
      is_auto_managed: true,
      stop_at_ratio: true,
      stop_ratio: 0,
      remove_at_ratio: false,
      prioritize_first_last: false,
      move_completed: true,
      move_completed_path: "",
      super_seeding: false,
    },
  });
  const options = trpc.deluge.getTorrentInfoMin.useQuery(
    {
      id: id,
      options: v2 ? v2op : v1op,
    },
    {
      onSuccess(data) {
        console.log(data);
        setLoading(false);
        form.setValues({
          max_download_speed: data.max_download_speed,
          max_upload_speed: data.max_upload_speed,
          max_connections: data.max_connections,
          max_upload_slots: data.max_upload_slots,
          is_auto_managed: data.is_auto_managed,
          stop_at_ratio: data.stop_at_ratio,
          stop_ratio: data.stop_ratio,
          remove_at_ratio: data.remove_at_ratio,
          prioritize_first_last: data.prioritize_first_last,
          move_completed: data.move_completed,
          move_completed_path: data.move_completed_path,
          super_seeding: data.super_seeding,
        });
      },
    }
  );

  const setOption = trpc.deluge.setTorrentOption.useMutation({
    onSuccess() {
      start();
    },
  });
  return (
    <Card shadow={"sm"} radius={"sm"} mt={0} m={"md"} withBorder bg={"dark.9"}>
      <Flex direction={"column"} gap={"sm"}>
        <Grid grow mt={"xs"} gutter={"sm"} columns={2}>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              min={-1}
              label={"Max Connection"}
              {...form.getInputProps("max_connections")}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              min={-1}
              label={"Max Upload Slots"}
              {...form.getInputProps("max_upload_slots")}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              min={-1}
              label={"Max DL Speed"}
              {...form.getInputProps("max_download_speed")}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              size="xs"
              min={-1}
              label={"Max UP Speed"}
              {...form.getInputProps("max_upload_speed")}
            />
          </Grid.Col>
        </Grid>
        <Checkbox
          mt={"md"}
          size={"sm"}
          {...form.getInputProps("move_completed", {
            type: "checkbox",
          })}
          label={"Move Completed"}
        />
        <TextInput
          disabled={!form.values.move_completed}
          label="Move Completed Location"
          {...form.getInputProps("move_completed_path")}
        />
        <Checkbox
          mt={"sm"}
          label="Auto Managed"
          {...form.getInputProps("is_auto_managed", {
            type: "checkbox",
          })}
        />
        <Group>
          <Checkbox
            mt={"xs"}
            label="Stop Seed at Ratio"
            {...form.getInputProps("stop_at_ratio", {
              type: "checkbox",
            })}
          />
          <NumberInput
            disabled={!form.values.stop_at_ratio}
            size="xs"
            w={"80px"}
            ml={"sm"}
            min={0}
            {...form.getInputProps("stop_ratio")}
          />
        </Group>
        <Checkbox
          mt={"xs"}
          disabled={!form.values.stop_at_ratio}
          label="Remove at Ratio"
          {...form.getInputProps("remove_at_ratio", {
            type: "checkbox",
          })}
        />

        <Checkbox
          mt={"xs"}
          label="Prioritize First/Last Pieces"
          {...form.getInputProps("prioritize_first_last", {
            type: "checkbox",
          })}
        />
        {v2 && (
          <Checkbox
            mt={"xs"}
            label="Super Seed"
            {...form.getInputProps("super_seeding", {
              type: "checkbox",
            })}
          />
        )}
        <Button
          loading={loading}
          onClick={() => {
            const data = findDiff(options.data!, form.values);
            console.log(data);
            setLoading(true);
            setOption.mutate({
              id: id,
              data: data,
            });
          }}
        >
          Apply
        </Button>
      </Flex>
    </Card>
  );
};

export default TorrentOption;
