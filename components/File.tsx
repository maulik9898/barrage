import {
  Card,
  Center,
  Flex,
  Group, Select,
  Text
} from "@mantine/core";
import { Content } from "../deluge";
import { humanFileSize } from "../utils/helper";

const File = ({
  name,
  content,
  onChange,
}: {
  name: string;
  content: Content;
  onChange: (data: Record<number, number>) => void;
}) => {
  return (
    <Card
      withBorder
      mt={4}
      ta={"center"}
      p={"xs"}
      sx={(theme) => ({
        backgroundColor: theme.colors.dark,
        //borderColor: content.priority === 0 ? theme.colors.red : theme.colors.blue[content.priority]
      })}
    >
      <Flex gap={"xs"} direction={"row"}>
        <Center inline>
          <Select
            withinPortal
            value={content.priority.toString()}
            onChange={(e) => {
              if (e) {
                onChange({ [content.index!]: parseInt(e) });
              }
            }}
            size={"xs"}
            styles={(theme) => ({
              input: {
                width: "40px",
                padding: "4px",
                textAlign: "center",
              },
              rightSection: {
                display: "none",
              },
            })}
            data={["0", "1", "4", "5", "7"]}
          />
          <Flex ta={"center"} ml={"sm"} direction={"column"}>
            <Text
              sx={{ wordBreak: "break-all" }}
              fz={"xs"}
              miw={0}
              ta="start"
              lineClamp={2}
            >
              {name}
            </Text>
            <Group>
              <Text size={"xs"} weight="bold" color={"dimmed"}>{`${(
                content.progress * 100
              ).toFixed(0)}%`}</Text>
              {content.progress === 1 ? (
                <>
                <Text
                  size={"xs"}
                  weight="bold"
                  color={"blue"}
                >{`Downloaded`}</Text>
                <Text
                  size={"xs"}
                  weight="bold"
                  color={"dimmed"}
                >{`${humanFileSize(content.size)}`}</Text>
                </>
              ) : (
                <Text
                  size={"xs"}
                  weight="bold"
                  color={"dimmed"}
                >{`${humanFileSize(
                  content.size * content.progress
                )} / ${humanFileSize(content.size)}`}</Text>
              )}
            </Group>
          </Flex>
        </Center>
      </Flex>
    </Card>
  );
};

export default File;
