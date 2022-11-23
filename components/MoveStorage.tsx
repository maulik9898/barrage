import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { trpc } from "../utils/trpc";

const MoveStorage = ({ id, close }: { id: string; close: () => void }) => {
  const form = useForm({
    initialValues: {
      location: "",
    },
    validate: {
      location: (value) => (value ? null : "Location is required"),
    },
  });

  const moveStorage = trpc.deluge.moveStorage.useMutation({});
  return (
    <form>
      <Flex direction={"column"} gap={"md"}>
        <TextInput
          label="Location"
          withAsterisk
          {...form.getInputProps("location")}
        />
        <Button
          loading={moveStorage.isLoading}
          disabled={!form.isValid()}
          onClick={() => {
            moveStorage.mutate({
              id: id,
              location: form.values.location,
            });
            close();
          }}
        >
          Move
        </Button>
      </Flex>
    </form>
  );
};

export default MoveStorage;
