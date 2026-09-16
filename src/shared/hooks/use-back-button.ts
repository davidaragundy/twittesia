import { useRouter } from "next/navigation";

type Props = {
  // Where to go when there is no page to go back to, such as a link opened in a new tab
  fallbackHref: string;
};

export const useBackButton = ({ fallbackHref }: Props) => {
  const router = useRouter();

  return {
    goBack: () => {
      if (window.history.length > 1) router.back();
      else router.push(fallbackHref);
    },
  };
};
