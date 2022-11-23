import { Button, Menu, Select } from "@mantine/core";
import { useForceUpdate } from "@mantine/hooks";
import { closeAllModals, ContextModalProps, openModal } from "@mantine/modals";
import { IconTag } from "@tabler/icons";
import { useEffect, useState } from "react";
import useTorrentStore from "../stores/useTorrentStore";
import { trpc } from "../utils/trpc";

const Label = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ id: string; refetch: () => void }>) => {
  const forceUpdate = useForceUpdate();
  const labels = useTorrentStore((state) => state.lables);
  const [err, setErr] = useState("");
  const setLabel = trpc.deluge.setLabel.useMutation({
    onSuccess() {
      innerProps.refetch();
    },
    onSettled(data, error, variables, context) {
      if (error) {
        setErr(error.message);
      }
    },
  });
  const createLabel = trpc.deluge.addLabel.useMutation({
    onSuccess(data, variables, context) {
      setLabel.mutate({
        id: innerProps.id,
        label: variables.label,
      });
    },
    onSettled(data, error, variables, context) {
      if (error) {
        setErr(error.message);
      }
    },
  });
  const data = [
    ...labels
      .filter((s) => s.name.toLowerCase() !== "all")
      .filter((s) => s.name)
      .map((s) => ({ value: s.name, label: s.name })),
    { value: "", label: "No Label" },
  ];

  return (
    <>
      <Select
        label="Label"
        data={data}
        error={err}
        placeholder="Select label"
        nothingFound="Nothing found"
        searchable
        creatable
        onChange={(e) => {
          if (e !== null) {
            if (!labels.some((l) => l.name === e) && e !== "") {
              createLabel.mutate({
                label: e,
              });
            } else {
              setLabel.mutate({
                id: innerProps.id,
                label: e,
              });
            }
          }
        }}
        getCreateLabel={(query) => `+ Set ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          return item;
        }}
      />
      <Button fullWidth mt={"sm"} onClick={() => context.closeModal(id)}>
        Done
      </Button>
    </>
  );
};

export default Label;
