/** Material Symbols icon. <Icon name="favorite" className="text-4xl" /> */
export default function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}
