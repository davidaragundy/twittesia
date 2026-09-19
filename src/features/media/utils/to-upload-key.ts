interface Props {
  pathname: string;
}

// An upload that has been authorised and not yet attached to anything
export const toUploadKey = ({ pathname }: Props) => `upload:${pathname}`;
