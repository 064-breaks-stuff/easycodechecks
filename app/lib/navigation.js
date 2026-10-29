export function navigationMatches(pathname, item) {
  if (pathname === item.href) return true;
  if (item.href === "/blog" && pathname.startsWith("/post/")) return true;
  return (item.children ?? []).some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`));
}
