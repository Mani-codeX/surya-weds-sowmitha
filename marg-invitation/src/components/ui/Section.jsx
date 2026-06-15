/**
 * Section — a full-width page section with the standard vertical rhythm and
 * horizontal container padding from the design tokens.
 *
 * `pad` toggles the default `py-section-gap px-container-padding` spacing
 * (turn off for full-bleed/cinematic sections that manage their own layout).
 */
export default function Section({
  as = "section",
  id,
  pad = true,
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  const base = pad ? "py-section-gap px-container-padding" : "";
  return (
    <Tag id={id} className={`relative ${base} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
