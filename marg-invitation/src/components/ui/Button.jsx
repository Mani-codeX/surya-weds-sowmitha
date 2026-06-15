/**
 * Button — two variants from DESIGN.md, sharp (zero-radius) architectural shape.
 *   primary  : solid Deep Maroon, ivory all-caps label
 *   secondary: ghost with a 1px Antique Gold border
 */
const VARIANTS = {
  primary:
    "bg-primary text-on-primary border border-secondary/30 hover:bg-primary/90",
  secondary:
    "border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary",
};

export default function Button({
  variant = "primary",
  as = "button",
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  return (
    <Tag
      className={`px-8 py-4 rounded-none font-label-caps text-label-caps transition-all ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
