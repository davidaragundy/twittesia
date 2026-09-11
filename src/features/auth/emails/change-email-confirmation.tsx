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
  newEmail: string;
  url: string;
}

const ChangeEmailConfirmation = ({ url, name, newEmail }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>bitch, we gotta be sure its really you 🧐</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-116.25 rounded-2xl border border-solid border-[#eaeaea] p-5">
            <Section className="mt-8">
              <Heading className="font-extrabold">Twittesia</Heading>
            </Section>
            <Heading className="mx-0 my-7.5 p-0 text-center text-[24px] font-normal text-black">
              Change email confirmation
            </Heading>
            <Text className="text-[14px] leading-6 text-black">Hello {name},</Text>
            <Text className="text-[14px] leading-6 text-black">
              To change your email address to <strong>{newEmail}</strong>, please confirm this is
              correct. Click the button below to confirm, and we will send a verification link to
              your new email address to complete the process.
            </Text>
            <Section className="mt-8 mb-8 text-center">
              <Button
                className="rounded-2xl bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Confirm
              </Button>
            </Section>
            <Text className="text-[14px] leading-6 text-black">
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

ChangeEmailConfirmation.PreviewProps = {
  url: "https://twittesia.aragundy.com/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdmlkYXJhZ3VuZHlAb3V0bG9vay5jb20iLCJpYXQiOjE3NDE5Njc4NzQsImV4cCI6MTc0MTk3MTQ3NH0.9AjvRxMX1jwIw7XfagZThFe9eTBtc8utmM3VV7F8jqs&callbackURL=/",
  name: "David Aragundy",
} as Props;

export default ChangeEmailConfirmation;
