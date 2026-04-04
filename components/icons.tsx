export function LogoMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f8c76,#16362f)] text-lg font-bold text-white shadow-[0_18px_40px_rgba(15,99,84,0.22)]">
      CC
    </div>
  );
}

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    className,
  };

  switch (name) {
    case "location":
      return (
        <svg {...shared}>
          <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "search":
      return (
        <svg {...shared}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "menu":
      return (
        <svg {...shared}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "cart":
      return (
        <svg {...shared}>
          <circle cx="9" cy="19" r="1.3" />
          <circle cx="17" cy="19" r="1.3" />
          <path d="M4 5h2l1.5 8h9L19 8H8" />
        </svg>
      );
    case "user":
      return (
        <svg {...shared}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 19a7 7 0 0 1 14 0" />
        </svg>
      );
    case "star":
      return (
        <svg {...shared}>
          <path d="m12 4 2.3 4.8 5.3.8-3.8 3.7.9 5.3L12 16l-4.7 2.6.9-5.3-3.8-3.7 5.3-.8L12 4Z" />
        </svg>
      );
    case "truck":
      return (
        <svg {...shared}>
          <path d="M3 7h10v8H3z" />
          <path d="M13 10h4l2 2.5V15h-6" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="17" cy="17" r="1.5" />
        </svg>
      );
    case "tag":
      return (
        <svg {...shared}>
          <path d="M20 10 11 19l-7-7V4h8l8 6Z" />
          <circle cx="8.5" cy="8.5" r="1" />
        </svg>
      );
    case "phone":
      return (
        <svg {...shared}>
          <path d="M7 5h3l1 4-1.8 1.8a14.5 14.5 0 0 0 4 4L15 13l4 1v3c0 1.1-.9 2-2 2C10.9 19 5 13.1 5 6.9 5 5.9 5.9 5 7 5Z" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...shared}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...shared}>
          <path d="M12 3 6.5 5v5.4c0 4.3 2.3 7.4 5.5 9.6 3.2-2.2 5.5-5.3 5.5-9.6V5L12 3Z" />
          <path d="m9.5 12 1.7 1.7 3.3-3.7" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...shared}>
          <path d="M19 5c-6.5.2-10.7 2.9-12.4 8.2-.7 2.1-.8 3.9-.8 5.8 1.8 0 3.3-.2 5.2-.8C16.1 16.6 18.8 12.4 19 5Z" />
          <path d="M7 17c2.5-3 5.2-5.2 8.3-6.7" />
        </svg>
      );
    case "fish":
      return (
        <svg {...shared}>
          <path d="M4 12c2.8-3.8 6-5.7 9.8-5.7 1.4 0 2.7.3 4.2.8l2-1v4.9l-2-1c-1.4.5-2.8.7-4.2.7-3.8 0-7 2-9.8 5.7 1.1-1.6 1.1-7.4 0-9.4Z" />
          <circle cx="14.5" cy="10.5" r=".8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "home":
      return (
        <svg {...shared}>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6 9.5V20h12V9.5" />
        </svg>
      );
    case "cup":
      return (
        <svg {...shared}>
          <path d="M7 6h8v5a4 4 0 0 1-8 0V6Z" />
          <path d="M15 7h1.8A2.2 2.2 0 0 1 19 9.2v.1A2.7 2.7 0 0 1 16.3 12H15" />
          <path d="M8 19h6" />
        </svg>
      );
    case "bread":
      return (
        <svg {...shared}>
          <path d="M6 11a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5Z" />
          <path d="M10 7v2M14 7v2" />
        </svg>
      );
    case "drop":
      return (
        <svg {...shared}>
          <path d="M12 3c3.3 4 5 6.7 5 9.2A5 5 0 0 1 7 12.2C7 9.7 8.7 7 12 3Z" />
        </svg>
      );
    case "jar":
      return (
        <svg {...shared}>
          <path d="M9 4h6" />
          <path d="M8 7h8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7Z" />
        </svg>
      );
    case "grid":
      return (
        <svg {...shared}>
          <rect x="4.5" y="4.5" width="6" height="6" rx="1" />
          <rect x="13.5" y="4.5" width="6" height="6" rx="1" />
          <rect x="4.5" y="13.5" width="6" height="6" rx="1" />
          <rect x="13.5" y="13.5" width="6" height="6" rx="1" />
        </svg>
      );
    case "check":
      return (
        <svg {...shared}>
          <path d="m5 12 4 4 10-10" />
        </svg>
      );
    default:
      return null;
  }
}
