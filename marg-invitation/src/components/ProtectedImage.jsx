/**
 * ProtectedImage — wraps <img> with the casual-download protections from
 * wed-formar.md: no dragging, no right-click context menu, no selection. Lazy
 * loads by default. Use for all personal wedding photos.
 */
export default function ProtectedImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  style,
  ...rest
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      draggable="false"
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitUserDrag: "none", ...style }}
      {...rest}
    />
  );
}
