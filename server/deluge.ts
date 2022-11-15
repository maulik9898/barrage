import { Deluge } from "../deluge/index";

const delugeClient = new Deluge({
  baseUrl: process.env.DELUGE_URL,
  password: process.env.DELUGE_PASSWORD,
});

export default delugeClient;
