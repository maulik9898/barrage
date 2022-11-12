import { Accordion, Box, Center, Select, Text } from "@mantine/core";
import { Content } from "../deluge";
import { getFileMap } from "../utils/helper";

const Directory = ({
  name,
  content,
  onChange,
}: {
  name: string;
  content: Content;
  onChange: (data: Record<number, number>) => void;
}) => {
  const setDirPriority = (priority: number) => {
    const fileMap = getFileMap(content.contents!, priority);
    onChange(fileMap);
  };
  return (
    <Box
      sx={(theme)=>({
        display: "flex",
        alignItems: "center",
        "&:hover": {
          backgroundColor: theme.colors.dark[6],
        },
      })}
    >
      <Select
        ml={"md"}
        withinPortal
        value={content.priority.toString()}
        onChange={(e) => {
          if (e) {
            setDirPriority(parseInt(e));
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
      <Accordion.Control>
        <Center inline>
          <Text
            sx={{ wordBreak: "break-all" }}
            weight={"bold"}
            color={"teal"}
            ml={"md"}
            size={"sm"}
            lineClamp={1}
          >
            {name}
          </Text>
        </Center>
      </Accordion.Control>
    </Box>
  );
};

export default Directory;
