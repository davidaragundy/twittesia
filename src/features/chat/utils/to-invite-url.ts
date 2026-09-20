import { toJoinPath } from "@/features/chat/utils/to-join-path";

interface Props {
  id: string;
  // The half of the invite that never reaches a server
  secret: string;
}

// The whole invite, ready to be sent to one person
export const toInviteUrl = ({ id, secret }: Props) =>
  `${window.location.origin}${toJoinPath({ id })}#${secret}`;
