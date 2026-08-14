import Image from "next/image";

/** "Isbatul Haque Samin" -> "IS" */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

type Props = {
  name: string;
  photo?: string;
  className?: string;
};

/**
 * A person's headshot, falling back to their initials on a red gradient when
 * no photo has been supplied yet. The fallback is styled deliberately rather
 * than apologetically, so a half-confirmed speaker line-up still looks whole.
 */
export default function Avatar({ name, photo, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-ink-soft ${className}`}>
      {photo ? (
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ted/25 via-ink-soft to-ink">
          <span className="text-4xl font-black tracking-tight text-ted/70 md:text-5xl">
            {initials(name)}
          </span>
        </div>
      )}
    </div>
  );
}
