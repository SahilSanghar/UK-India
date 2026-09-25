import Client from "./Client";
import { fetchPage } from "@/lib/fetchPage";
import { PageProps } from "@/lib/PageProps";

const getPage = async () => {
  try {
    const page = await fetchPage("strategic-partnership");
    return (page as Partial<PageProps> | undefined) ?? null;
  } catch {
    return null;
  }
};

export default async function Page() {
  const page = await getPage();
  return <Client page={page} />;
}

export const revalidate = 60;
