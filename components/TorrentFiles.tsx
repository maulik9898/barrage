/* eslint-disable react-hooks/exhaustive-deps */
import { Accordion, Alert, Card, Flex, Skeleton } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons";
import { useEffect, useMemo, useState } from "react";
import { getFileMap } from "../utils/helper";
import { trpc } from "../utils/trpc";
import ContentDropDown from "./ContentDropDown";
import Directory from "./Directory";
import File from "./File";

const TorrentFiles = ({ id }: { id: string }) => {
  const [enabled, setEnabled] = useState(0);
  const { start, clear } = useTimeout(() => setEnabled(0), 5000);

  const files = trpc.deluge.getFiles.useQuery(
    { id: id },
    {
      refetchInterval: enabled,
    }
  );

  useEffect(() => {
    files.refetch();
  }, []);

  const setPriority = trpc.deluge.setFilePriority.useMutation({
    onSuccess(data, variable) {
      setEnabled(1000);
      start();
    },
  });

  const updateFilePriority = (data: Record<number, number>) => {
    const fileMap = getFileMap(files.data?.result.contents!);
    const updatedMap = { ...fileMap, ...data };
    const arr: number[] = [];
    Object.entries(updatedMap)
      .sort(([i, p], [i1, p1]) => parseInt(i) - parseInt(i1))
      .forEach(([i, p]) => {
        arr.push(p);
      });
    setPriority.mutate(
      {
        id: id,
        priority: arr,
      },
      {
        onSuccess() {
          setPriority.mutate({
            id: id,
            priority: arr,
          });
        },
      }
    );
  };

  const getFiles = useMemo(() => {
    return Object.entries(files.data?.result.contents || {})
      .sort()
      .map(([name, c]) => {
        return c.type === "dir" ? (
          <Accordion.Item value={name} key={name}>
            <Directory name={name} onChange={updateFilePriority} content={c} />
            <Accordion.Panel>
              <ContentDropDown setPriority={updateFilePriority} content={c} />
            </Accordion.Panel>
          </Accordion.Item>
        ) : (
          <Accordion.Item value={name} key={name}>
            <Accordion.Control>Root Files</Accordion.Control>
            <Accordion.Panel>
              <File name={name} onChange={updateFilePriority} content={c} />
            </Accordion.Panel>
          </Accordion.Item>
        );
      });
  }, [files.data?.result.contents]);

  if (!files.data) {
    return (
      <Card withBorder m={"sm"}>
        <Card.Section>
          <Flex m={"sm"} gap={"md"} align={"center"}>
            <Skeleton height={30} width={45} />
            <Skeleton ml={"md"} height={15} />
            <Skeleton ml={"md"} height={25} width={25} />
          </Flex>
        </Card.Section>
      </Card>
    );
  }

  return (
    <>
      <Alert
        m={"sm"}
        mt={0}
        icon={<IconAlertCircle size={16} />}
        title="Set priority using Dropdown menu"
        variant="light"
      >
        0 - Do not download &nbsp; &nbsp; &nbsp;
        <br /> 1 - Low &nbsp; &nbsp; &nbsp; 4 - Normal &nbsp; &nbsp; &nbsp; 5 -
        High &nbsp; &nbsp; &nbsp; <br /> 7 - Highest priority
      </Alert>
      <Accordion mt={0} m={"sm"} radius={0} variant="contained">
        {getFiles}
      </Accordion>
    </>
  );
};

export default TorrentFiles;
