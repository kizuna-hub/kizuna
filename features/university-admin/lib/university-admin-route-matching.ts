export function isUniversityAdminRouteActive({
  pathname,
  href,
  exact = false,
}: {
  pathname: string;
  href: string;
  exact?: boolean;
}) {
  if (exact) return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}
