import Client from "./Client";
import { fetchPage } from "@/lib/fetchPage";
import { PageProps } from "@/lib/PageProps";

const getPage = async () => {
  const page = await fetchPage("home");
  return page as PageProps;
};

export default async function Page() {
  const page = await getPage();
  return <Client pages={page} />;
}

export const revalidate = 60;