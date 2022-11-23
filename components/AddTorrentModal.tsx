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
import { UseFormReturnType } from "@mantine/form";
import { IconSettings } from "@tabler/icons";
import { ConfigValues } from "../deluge";
import TorrentOptionForm from "./TorrentOptionForm";

const AddTorrentModal = ({
  
  form,
}: {
  form: UseFormReturnType<ConfigValues, (values: ConfigValues) => ConfigValues>;
}) => {
  return (
    <Accordion variant="separated">
      <Accordion.Item value="Advance options">
        <Accordion.Control icon={<IconSettings size={20} color="teal" />}>
          Advance options
        </Accordion.Control>
        <Accordion.Panel>
          <form>
            <TorrentOptionForm form={form} />
          </form>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default AddTorrentModal;
