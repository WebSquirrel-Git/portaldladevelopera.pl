export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`https://formsubmit.co/ajax/${process.env.FORM_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
if (!res.ok) {
    return new Response(
      JSON.stringify({ ok: false, status: res.status }),
      {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return new Response(
    JSON.stringify({ ok: true }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
