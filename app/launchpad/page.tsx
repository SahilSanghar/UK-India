import Client from "./Client";

const getPage = async () => {
  const res = await fetch(process.env.PUBLIC_URL + "/api/admin/pages/get_by_type?type=launchpad", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch page");
  }
  
  const data = await res.json();

  return data.page;
};


export default async function Page() {
  const page = await getPage();
  return <Client page={page} />;
}