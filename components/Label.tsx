import { Button, Menu, Select } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { IconTag } from "@tabler/icons";
import useTorrentStore from "../stores/useTorrentStore";
import { trpc } from "../utils/trpc";

const Label = ({ id, refetch }: { id: string; refetch: () => void }) => {
  const labels = useTorrentStore((state) => state.lables);
  const setLabel = trpc.deluge.setLabel.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const createLabel = trpc.deluge.addLabel.useMutation({
    onSuccess(data, variables, context) {
      setLabel.mutate({
        id: id,
        label: variables.label,
      });
    },
  });
  const data = [
    ...labels.filter((s) => s.name.toLowerCase() !== 'all').filter((s) => s.name).map((s) => ({ value: s.name, label: s.name })),
    { value: "", label: "No Label" },
  ];
  const openLabelModel = () =>
    openModal({
      title: "Select Label",
      centered: true,
      withCloseButton: false,
      children: (
        <>
          <Select
            label="Label"
            data-autofocus
            data={data}
            placeholder="Select label"
            nothingFound="Nothing found"
            searchable
            creatable
            onChange={(e) => {
              if (e !== null) {
                if (!labels.some((l) => l.name === e ) && e !== '') {
                  createLabel.mutate({
                    label: e,
                  });
                } else {
                  setLabel.mutate({
                    id: id,
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
          <Button fullWidth mt={'sm'} onClick={() => closeAllModals()}>Done</Button>
        </>
      ),
    });
  return (
    <Menu.Item onClick={openLabelModel} icon={<IconTag size={14} />}>
      Label
    </Menu.Item>
  );
};

export default Label;
