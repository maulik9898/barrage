import {
  Accordion
} from "@mantine/core";
import { useMemo } from "react";
import { Content } from "../deluge";
import Directory from "./Directory";
import File from "./File";


const ContentDropDown = ({
  content,
  setPriority,
}: {
  content: Content;
  setPriority: (data: Record<number, number>) => void;
}) => {
  
  const dirs = useMemo(() => {
    const tmp: [string, Content][] = [];

    Object.entries(content.contents || {}).forEach(([n, c]) => {
      if (c.type === "dir") {
        tmp.push([n, c]);
      }
    });

    return tmp.sort(([n, c], [n1, c1]) => n.localeCompare(n1));
  }, [content]);

  const files = useMemo(() => {
    const tmp: [string, Content][] = [];

    Object.entries(content.contents || {}).forEach(([n, c]) => {
      if (c.type === "file") {
        tmp.push([n, c]);
      }
    });

    return tmp.sort(([n, c], [n1, c1]) => n.localeCompare(n1));
  }, [content]);

  return (
    <>
      {files.map(([n, c]) => {
        return <File onChange={setPriority} key={n} name={n} content={c} />;
      })}
      <Accordion
        variant="contained"
        mt={'sm'}
      >
        {dirs.map(([n, c]) => {
          return (
            <Accordion.Item value={n} key={n}>
              <Directory name={n} content={c} onChange={setPriority} />
              <Accordion.Panel>
                <ContentDropDown setPriority={setPriority} content={c} />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
};

export default ContentDropDown;
