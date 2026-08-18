import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

const BASE = __ENV.BASE_URL || "http://localhost";

export default function () {
  const live = http.get(`${BASE}/health/live`);
  check(live, { "live is 200": (r) => r.status === 200 });
  sleep(1);
}
