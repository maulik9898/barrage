import { Content } from "../deluge";

export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 *
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the amount of time
 */
export function forHumansSeconds(seconds: number) {
  var levels = [
    [Math.floor(seconds / 31536000), "y"],
    [Math.floor((seconds % 31536000) / 86400), "d"],
    [Math.floor(((seconds % 31536000) % 86400) / 3600), "h"],
    [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), "m"],
    [(((seconds % 31536000) % 86400) % 3600) % 60, "s"],
  ];
  var returntext = "";
  var depth = 2;
  var count = 0;

  for (var i = 0, max = levels.length; i < max; i++) {
    if (levels[i][0] === 0) continue;
    if (count == depth) break;
    returntext += " " + levels[i][0] + levels[i][1];
    count++;
  }
  return returntext.trim();
}

interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }
  dequeue(): T | undefined {
    return this.storage.shift();
  }
  size(): number {
    return this.storage.length;
  }
}

export const getFileMap = (
  content: Record<string, Content>,
  priority?: number
) => {
  const queue = new Queue<Record<string, Content>>();
  const fileMap: Record<number, number> = {};
  queue.enqueue(content);
  while (queue.size()) {
    const data = queue.dequeue()!;
    Object.entries(data).forEach(([n, c]) => {
      if (c.type === "file") {
        fileMap[c.index!] = priority === undefined ? c.priority : priority;
      } else {
        queue.enqueue(c.contents!);
      }
    });
  }
  return fileMap;
};

// Or
export const removeNullUndefined = (obj: any) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
