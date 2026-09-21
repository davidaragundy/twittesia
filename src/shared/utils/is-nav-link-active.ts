interface Props {
  href: string;
  pathname: string;
}

// A section stays marked on the pages inside it: /chats is on for /chats/<id> too
export const isNavLinkActive = ({ href, pathname }: Props) =>
  pathname === href || pathname.startsWith(`${href}/`);
