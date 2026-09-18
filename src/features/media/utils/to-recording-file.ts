interface Props {
  chunks: Blob[];
  // The type the recorder wrote, codecs and all
  mimeType: string;
  name: string;
}

// A recording as a file like any other chosen one. Its type loses the codec parameters, which
// the upload rules don't list, and its name takes the extension of that type.
export const toRecordingFile = ({ chunks, mimeType, name }: Props) => {
  const type = mimeType.split(";")[0]?.trim() ?? "";
  const extension = type.split("/")[1] ?? "bin";

  return new File(chunks, `${name}.${extension}`, { type });
};
