import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { RouterTransition } from "../components/RouterTransition";
import { SessionProvider } from "next-auth/react";
import { ModalsProvider } from "@mantine/modals";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Label from "../components/Label";

export function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Barrage</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "dark",
          }}
        >
          <ModalsProvider modals={{ labelModel: Label }}>
            <RouterTransition />
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen />
          </ModalsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}

export default trpc.withTRPC(App);
