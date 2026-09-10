import Image from "next/image";

type Props = {
  size?: number;
};

export function Logo({ size = 24 }: Props) {
  return (
    <>
      <Image
        src="/images/twittesia-logo-dark.svg"
        alt=""
        width={size}
        height={size}
        className="hidden dark:block"
        loading="eager"
      />
      <Image
        src="/images/twittesia-logo-light.svg"
        alt=""
        width={size}
        height={size}
        className="block dark:hidden"
        loading="eager"
      />
    </>
  );
}
