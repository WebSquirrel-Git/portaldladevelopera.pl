"use server";

async function verifyCaptcha(token: string | null): Promise<boolean> {
  if (!token) {
    return false;
  }

  let data: any;

  try {
    const res = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: "POST",
        // @ts-ignore
        next: {
          revalidate: 120,
        },
      },
    );

    data = await res.json();
  } catch (e) {
    console.error(e);
    return false;
  }

  return data.success;
}

export { verifyCaptcha };
