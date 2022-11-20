/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  Loader,
  NumberInput,
  Radio,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { IconSettings } from "@tabler/icons";
import { useEffect, useState } from "react";
import { ConfigValues } from "../deluge";
import useTorrentStore from "../stores/useTorrentStore";
import { trpc } from "../utils/trpc";

const AddTorrentModal = ({
  v2,
  form,
}: {
  v2: boolean;
  form: UseFormReturnType<ConfigValues, (values: ConfigValues) => ConfigValues>;
}) => {
  return (
    <Accordion variant="separated">
      <Accordion.Item value="Advance options">
        <Accordion.Control icon={<IconSettings size={20} color="teal" />}>
          Advance options
        </Accordion.Control>
        <Accordion.Panel>
          <form onSubmit={form.onSubmit(console.log)}>
            <TextInput
              label="Download Location"
              {...form.getInputProps("download_location")}
            />
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
            <Grid grow mt={"xs"} gutter={"sm"} columns={2}>
              <Grid.Col span={1}>
                <NumberInput
                  size="xs"
                  min={-1}
                  label={"Max Connection"}
                  {...form.getInputProps("max_connections_per_torrent")}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <NumberInput
                  size="xs"
                  min={-1}
                  label={"Max Upload Slots"}
                  {...form.getInputProps("max_upload_slots_per_torrent")}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <NumberInput
                  size="xs"
                  min={-1}
                  label={"Max DL Speed"}
                  {...form.getInputProps("max_download_speed_per_torrent")}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <NumberInput
                  size="xs"
                  min={-1}
                  label={"Max UP Speed"}
                  {...form.getInputProps("max_upload_speed_per_torrent")}
                />
              </Grid.Col>
            </Grid>
            {v2 ? (
              <Grid
                grow
                columns={2}
                align={"center"}
                justify={"left"}
                gutter={"sm"}
              >
                <Grid.Col span={1}>
                  <Checkbox
                    mt={"xs"}
                    label="Sequential Download"
                    {...form.getInputProps("sequential_download", {
                      type: "checkbox",
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <Checkbox
                    mt={"xs"}
                    label="Add In Paused State"
                    {...form.getInputProps("add_paused", {
                      type: "checkbox",
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <Checkbox
                    mt={"xs"}
                    label="Preallocate Disk Space"
                    {...form.getInputProps("pre_allocate_storage", {
                      type: "checkbox",
                    })}
                  />
                </Grid.Col>

                <Grid.Col span={1}>
                  <Checkbox
                    mt={"xs"}
                    label="Super Seed"
                    {...form.getInputProps("super_seeding", {
                      type: "checkbox",
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <Checkbox
                    mt={"xs"}
                    label="Prioritize First/Last Pieces"
                    {...form.getInputProps("prioritize_first_last_pieces", {
                      type: "checkbox",
                    })}
                  />
                </Grid.Col>
              </Grid>
            ) : (
              <>
                <Radio.Group
                  mt={"xs"}
                  label="Allocation"
                  value={form.values.compact_allocation ? "true" : "false"}
                  onChange={(value) => {
                    form.setFieldValue("compact_allocation", value === "true");
                  }}
                >
                  <Radio value={"false"} label="Full" />
                  <Radio value={"true"} label="Compact" />
                </Radio.Group>
                <Checkbox
                  mt={"xs"}
                  label="Add In Paused State"
                  {...form.getInputProps("add_paused", {
                    type: "checkbox",
                  })}
                />
                <Checkbox
                  mt={"xs"}
                  label="Prioritize First/Last Pieces"
                  {...form.getInputProps("prioritize_first_last_pieces", {
                    type: "checkbox",
                  })}
                />
              </>
            )}
          </form>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default AddTorrentModal;
