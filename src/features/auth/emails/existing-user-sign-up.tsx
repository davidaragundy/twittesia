import { type User } from "better-auth";
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
  Row,
  Column,
} from "react-email";

interface Props {
  user: User;
  request?: Request;
}

const ExistingUserSignUpEmail = ({ user, request }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>bitch, someone is trying to sign up with your email address 💀</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-2xl border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Twittesia</Heading>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Double sign up detected
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">Hello {user.name},</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We noticed a recent attempt to create a new account using this email address. Since
              you already have an account with us, no new account was created. To protect your
              privacy, we did not disclose to the requester that this email is already registered.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              If this was you, you can simply log in or reset your password. If you did not make
              this request, you can safely ignore this email.
            </Text>

            <Section className="mt-[32px] mb-[32px]">
              <Row className="mb-2">
                <Column className="w-1/3 font-semibold">Email</Column>
                <Column className="w-2/3">{user.email}</Column>
              </Row>

              <Row className="mb-2">
                <Column className="w-1/3 font-semibold">IP</Column>
                <Column className="w-2/3">{request?.headers.get("x-forwarded-for")}</Column>
              </Row>

              <Row className="">
                <Column className="w-1/3 font-semibold">User Agent</Column>
                <Column className="w-2/3">{request?.headers.get("user-agent")}</Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ExistingUserSignUpEmail.PreviewProps = {
  user: {
    name: "David Aragundy",
    email: "david@aragundy.com",
  } as User,
  request: {
    headers: new Headers({
      "x-forwarded-for": "127.0.0.1",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    }),
  } as Request,
} as Props;

export default ExistingUserSignUpEmail;
