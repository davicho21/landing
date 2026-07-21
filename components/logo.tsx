import Image from "next/image";

const LOCKUP_ASPECT = 408 / 124;

export function Logo({
  variant = "light",
  height = 28,
}: {
  variant?: "light" | "dark";
  height?: number;
}) {
  const src = variant === "light" ? "/brand/logo-lockup-light.png" : "/brand/logo-lockup.png";

  return (
    <Image
      src={src}
      alt="Academia Referente"
      width={Math.round(height * LOCKUP_ASPECT)}
      height={height}
      priority
    />
  );
}
