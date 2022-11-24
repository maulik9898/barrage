import { Button, Card, Flex, Group, PasswordInput } from "@mantine/core";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import React, { useState } from "react";
import { nextAuthOptions } from "../utils/nextAuthOption";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    nextAuthOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
  // ...
};

const Login = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") {
    router.push("/home");
  }

  const handleSignIn = async () => {
    setLoading(true);
    const d = await signIn("credentials", {
      password: password,
      redirect: false,
    });
    if (d?.ok) {
      router.push("/home");
    }
    if (d?.error) {
      setError("Invalid Password");
    }
    setLoading(false);
  };

  return (
    <Flex h={"100vh"} align={"center"} justify={"center"} direction={"column"}>
      <Card
        withBorder
        w={{ base: 300, xs: 500, sm: 700, md: 800, lg: 800, xl: 800 }}
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSignIn()
        }}>
          <PasswordInput
            size="md"
            label="Enter Password"
            value={password}
            error={error}
            mb={"lg"}
            styles={(theme) => ({
              label: {
                marginBottom: theme.spacing.sm,
              },
            })}
            onChange={(e) => {
              setError("");
              setPassword(e.currentTarget.value);
            }}
          />
          <Group grow>
            <Button
              type="submit"
              loading={loading}
              loaderPosition={"right"}
              size="md"
              mt={"xl"}
            >
              Login
            </Button>
          </Group>
        </form>
      </Card>
    </Flex>
  );
};

export default Login;
