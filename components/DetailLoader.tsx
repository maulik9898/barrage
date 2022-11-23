import { Card, Grid, Loader, Skeleton } from "@mantine/core";
import React from "react";

const DetailLoader = () => {
  return (
    <Card shadow={"sm"} radius={"sm"} mt={0} m={"md"} withBorder bg={"dark.9"}>
      <Grid gutter={"xl"} justify={"flex-start"}>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton width={"100%"} height={15} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton height={15} />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default DetailLoader;
