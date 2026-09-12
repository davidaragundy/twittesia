import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface Props {
  name: string;
  url: string;
}

const DeleteAccount = ({ url, name }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>leaving already? one click and you are gone 👻</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-2xl border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Twittesia</Heading>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Delete your account
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">Hello {name},</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Click the button below to delete your account, your profile and everything you have
              posted. This cannot be undone, and the link expires in one hour.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              If you did not ask for this, ignore this email and nothing happens.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded-2xl bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Delete my account
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={url} className="text-wrap break-all text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

DeleteAccount.PreviewProps = {
  url: "https://twittesia.aragundy.com/api/auth/delete-user/callback?token=JiiTi6msThuQRQghOkN1pWpR&callbackURL=/",
  name: "David Aragundy",
} as Props;

export default DeleteAccount;
