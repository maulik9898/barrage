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
import { useForm } from "@mantine/form";
import { IconSettings } from "@tabler/icons";
import { useEffect, useState } from "react";
import { ConfigValues } from "../deluge";
import useTorrentStore from "../stores/useTorrentStore";
import { trpc } from "../utils/trpc";

const AddTorrentModal = ({ close }: { close: () => void }) => {
  const v2 = useTorrentStore((s) => s.isv2);
  const form = useForm<ConfigValues>({
    initialValues: {
      add_paused: false,
      compact_allocation: undefined,
      download_location: "",
      max_connections_per_torrent: -1,
      max_download_speed_per_torrent: -1,
      move_completed: false,
      move_completed_path: "",
      max_upload_slots_per_torrent: -1,
      max_upload_speed_per_torrent: -1,
      prioritize_first_last_pieces: false,
      pre_allocate_storage: undefined,
      sequential_download: undefined,
      super_seeding: undefined,
    },
  });

  const addMagnet = trpc.deluge.addMagnet.useMutation();
  const [magnet, setMagnet] = useState("");
  const [magnetError, setMagnetError] = useState("");
  const magnetinfo = trpc.deluge.magnetInfo.useQuery(
    { magnet: magnet },
    {
      enabled: !!magnet,
      onError(err) {
        setMagnetError(err.message);
      },
    }
  );

  const config = trpc.deluge.configValue.useQuery(
    { v2: v2 },
    {
      enabled: false,
    }
  );

  useEffect(()=> {
    console.log(form.values)
  },[form.values])

  useEffect(() => {
    config.refetch();
  }, []);


  useEffect(() => {
    if (config.data) {
      form.setValues(config.data);
    }
  }, [config.data]);

  const context = trpc.useContext();
  return (
    <Box mx={"auto"}>
      <TextInput
        placeholder="Magnet url"
        label="Enter Magnet url"
        error={magnetError}
        onInput={(e) => {
          context.deluge.magnetInfo.cancel();
          setMagnetError("");
          setMagnet(e.currentTarget.value);
        }}
        value={magnet}
        withAsterisk
        required
        rightSection={magnetinfo.isFetching && <Loader size={"xs"} />}
      />
      <Space h={"xs"} />
      {magnetinfo.data && (
        <Text color={"dimmed"} weight="bold" size="xs">
          {magnetinfo.data?.name}
        </Text>
      )}
      <Space h={"md"} />
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
                      form.setFieldValue(
                        "compact_allocation",
                        value === "true"
                      );
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
      <Space h={"md"} />
      <Group position="right">
        <Button
          type="submit"
          onClick={() => {
            console.log(form.values)
            addMagnet.mutate({ magnet, config: form.values });
            close();
          }}
          disabled={!magnet || magnetError != ""}
          variant="light"
          color={"blue"}
          sx={(theme) => ({
            borderWidth: 1,
            borderColor: theme.colors.blue,
          })}
        >
          Add
        </Button>
      </Group>
    </Box>
  );
};

export default AddTorrentModal;
