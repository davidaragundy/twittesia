import { JOIN_PATH } from "@/features/chat/constants/join-path";

interface Props {
  id: string;
}

export const toJoinPath = ({ id }: Props) => `${JOIN_PATH}/${id}`;
