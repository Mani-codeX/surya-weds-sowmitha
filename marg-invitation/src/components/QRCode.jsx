import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";

/**
 * QRCode — renders a scannable QR code as a crisp image, generated locally
 * (no network). Colors match the wedding palette: deep maroon modules on an
 * ivory ground. `value` is the URL the QR encodes.
 */
export default function QRCode({
  value,
  size = 132,
  fg = "#4a0404", // deep maroon (matches --primary)
  bg = "#fdf6ee", // warm ivory
  className = "",
  alt = "QR code",
}) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let alive = true;
    QRCodeLib.toDataURL(value, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: size * 2, // 2× for retina crispness
      color: { dark: fg, light: bg },
    })
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [value, size, fg, bg]);

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
