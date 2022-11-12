import {
  ActionIcon, Badge, Tooltip, useMantineTheme
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconTag } from "@tabler/icons";

const BadgeToolTip = ({
  tag,
  toolTipLabel,
}: {
  tag?: string;
  toolTipLabel: string;
}) => {
  const theme = useMantineTheme();
  const largeScreen = useMediaQuery("(min-width: 800px)");
  return (
    <Tooltip withinPortal label={toolTipLabel} position="bottom" withArrow>
      <Badge
        variant="light"
        size={largeScreen ? "sm" : "xs"}
        m={0}
        radius={"md"}
        leftSection={
          <ActionIcon
            disabled
            size={largeScreen ? "sm" : "xs"}
            m={0}
            color="blue"
            radius="xl"
            variant="transparent"
          >
            <IconTag color={theme.colors.blue[7]} size={10} />
          </ActionIcon>
        }
      >
        {tag || "No Label"}
      </Badge>
    </Tooltip>
  );
};

export default BadgeToolTip;
