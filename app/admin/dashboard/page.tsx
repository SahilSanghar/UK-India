import { getSession } from "@/lib/session";

export default async function Page() {
  const session = await getSession();

  return (
    <div className="flex flex-row">
      <div className="w-full h-screen  flex flex-col gap-3 items-center justify-center">
        <h1 className="text-4xl">
          <b>Welcome,</b>{" "}
          {typeof session?.firstname === "string"
            ? session.firstname[0].toUpperCase() + session.firstname.slice(1)
            : "User"}{" "}
        </h1>
      </div>
    </div>
  );
}
