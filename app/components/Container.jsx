export default function Container({
  as: Component = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`container ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}