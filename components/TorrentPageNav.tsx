import { ActionIcon, Card, Center, Text, Tooltip } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import Link from "next/link";

const TorrentPageNav = ({ name }: { name: string }) => {
  return (
    <Card radius={0} shadow={"lg"} withBorder>
      <Card.Section
        p={"md"}
        sx={{
          display: "flex",
        }}
      >
        <Center inline>
          <Tooltip
            withinPortal
            label="Back"
            position="bottom"
            withArrow
            color={"cyan"}
          >
            <ActionIcon
              sx={(theme) => ({
                borderWidth: 1,
                borderColor: theme.colors.cyan,
              })}
              size={"xl"}
              component={Link}
              href="/home"
              color={"cyan"}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
          </Tooltip>
          <Text sx={{ wordBreak: "break-all" }} ml={"sm"} lineClamp={1}>
            {name}
          </Text>
        </Center>
      </Card.Section>
    </Card>
  );
};

export default TorrentPageNav;
