export async function fetchEventById(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/events/single?id=${id}`,
      { cache: "no-store" },
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data ?? null;
  } catch (error) {
    console.error("Failed to fetch event by id", error);
    return null;
  }
}