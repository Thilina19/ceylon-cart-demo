import { NextResponse } from "next/server";
import { isAdminSessionActive } from "@/lib/admin-auth";
import { getStorefrontData, updateStorefrontContent } from "@/lib/store-db";

export async function GET() {
  const storefront = await getStorefrontData();

  return NextResponse.json(storefront);
}

export async function PUT(request: Request) {
  if (!(await isAdminSessionActive())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    announcementBanner?: {
      active?: boolean;
      text?: string;
      ctaLabel?: string;
      ctaHref?: string;
    };
    promoPopup?: {
      id?: string;
      active?: boolean;
      eyebrow?: string;
      title?: string;
      description?: string;
      primaryLabel?: string;
      secondaryLabel?: string;
      image?: string;
    };
  };

  const storefront = await updateStorefrontContent({
    announcementBanner: body.announcementBanner,
    promoPopup: body.promoPopup,
  });

  return NextResponse.json({
    message: "Storefront marketing updated.",
    storefront,
  });
}
