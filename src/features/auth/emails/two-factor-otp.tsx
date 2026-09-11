import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface Props {
  name: string;
  otp: string;
}

const TwoFactorOTP = ({ name, otp }: Props) => {
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
              Two-factor authentication OTP
            </Heading>
            <Text className="text-[14px] leading-6 text-black">Hello {name},</Text>
            <Text className="text-[14px] leading-6 text-black">
              Use this one-time code to complete your sign-in. It expires in a few minutes.
            </Text>
            <Section className="mt-8 mb-8 text-center">
              <Text className="rounded-2xl bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline">
                {otp}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

TwoFactorOTP.PreviewProps = {
  name: "David Aragundy",
  otp: "123456",
} as Props;

export default TwoFactorOTP;
