import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Switch,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useTimeout } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { TorrentOptions } from "../deluge";
import { trpc } from "../utils/trpc";

const schema = z.object({
  max_connections: z.number().min(-1),
  max_download_speed: z.number().min(-1),
  max_upload_speed: z.number().min(-1),
  max_upload_slots: z.number().min(-1),
  auto_managed: z.boolean(),
});

const Options = ({ id }: { id: string }) => {
  const setOption = trpc.deluge.setTorrentOption.useMutation({
    onSuccess() {
      start();
    },
  });

  const { start, clear } = useTimeout(() => options.refetch(), 800);
  const [loading, setLoading] = useState(false);
  const options = trpc.deluge.getTorrentOption.useQuery(
    { id },
    {
      enabled: false,
      onSuccess(data) {
        setLoading(false);
        form.setValues({
          auto_managed: data.result.is_auto_managed,
          max_connections: data.result.max_connections,
          max_download_speed: data.result.max_download_speed,
          max_upload_speed: data.result.max_upload_speed,
          max_upload_slots: data.result.max_upload_slots,
        });
      },
    }
  );
  const form = useForm<Partial<TorrentOptions>>({
    initialValues: {
      max_connections: -1,
      max_download_speed: -1,
      max_upload_speed: -1,
      max_upload_slots: -1,
      auto_managed: true,
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    options.refetch();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Grid grow mt={"xs"} gutter={"sm"} columns={2}>
        <Grid.Col span={1}>
          <NumberInput
            required
            size="xs"
            min={-1}
            label={"Max Connection"}
            {...form.getInputProps("max_connections")}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <NumberInput
            required
            size="xs"
            min={-1}
            label={"Max Upload Slots"}
            {...form.getInputProps("max_upload_slots")}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <NumberInput
            required
            size="xs"
            min={-1}
            label={"Max DL Speed"}
            {...form.getInputProps("max_download_speed")}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <NumberInput
            required
            size="xs"
            min={-1}
            label={"Max UP Speed"}
            {...form.getInputProps("max_upload_speed")}
          />
        </Grid.Col>
      </Grid>
      <Checkbox
        mt={"sm"}
        label="Auto Managed"
        {...form.getInputProps("auto_managed", {
          type: "checkbox",
        })}
      />
      <Group position="right">
        <Button
          loading={loading}
          disabled={!form.isValid()}
          mt={"sm"}
          type="submit"
          onClick={() => {
            setLoading(true);
            setOption.mutate({
              id: id,
              data: form.values,
            });
          }}
        >
          {" "}
          Save
        </Button>
      </Group>
    </form>
  );
};

export default Options;
