import { PageWrapper } from "./styles";

type Props = {
  children: any;
};

export default function Page({ children }: Props) {
  return <PageWrapper>{children}</PageWrapper>;
}
