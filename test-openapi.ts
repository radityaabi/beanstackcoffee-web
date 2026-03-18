import createClient from "openapi-fetch";
import type { paths } from "./src/schema";

const fetchClient = createClient<paths>({
  baseUrl: "http://localhost:3000",
});

async function test() {
  const { data, error, response } = await fetchClient.POST("/auth/register", {
    body: {
      username: "openapi_test",
      email: "openapi_test@example.com",
      password: "Password123!",
    },
  });

  console.log("Status:", response.status);
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
