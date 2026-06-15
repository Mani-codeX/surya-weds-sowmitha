import { useReveal } from "../../hooks/useAnimations";

/**
 * <Reveal> — declarative scroll reveal wrapper.
 *   <Reveal as="h2" from="fadeUp" delay={0.1}>…</Reveal>
 */
export default function Reveal({
  as = "div",
  from = "fadeUp",
  duration,
  delay,
  ease,
  trigger,
  vars,
  className = "",
  children,
  ...rest
}) {
  const ref = useReveal({ from, duration, delay, ease, trigger, vars });
  const Tag = as;
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
