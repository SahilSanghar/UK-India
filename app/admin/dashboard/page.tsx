// app/dashboard/page.tsx  (SERVER)
import ClientPage from "./Client";
import { getSession } from "@/lib/session";

export default async function Page() {
  const session = await getSession();

  return <ClientPage session={session as { username: string, name: string }} />;
}
