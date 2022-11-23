import { Grid, Text } from "@mantine/core";
import React from "react";

const DetailGridCol = ({ label, value }: { label: string; value: string }) => {
  return (
    <>
      <Grid.Col span={4}>
        <Text fz={{ base: "sm", sm: "sm", md: "md", lg: "md" }} weight={"bold"}>
          {label}
        </Text>
      </Grid.Col>
      <Grid.Col span={8}>
        <Text
          fz={{ base: "sm", sm: "sm", md: "md", lg: "md" }}
          weight={'bold'}
          sx={{
            overflowWrap: "break-word",
          }}
          color="dimmed"
        >
          {value}
        </Text>
      </Grid.Col>
    </>
  );
};

export default DetailGridCol;
