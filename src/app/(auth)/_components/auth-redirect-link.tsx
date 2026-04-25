import Link from "next/link";

type Props = {
  text: string;
  linkText: string;
  href: string;
};

export const AuthRedirectLink = ({ text, linkText, href }: Props) => (
  <p className="text-center text-text-muted text-sm mt-6">
    {text}{" "}
    <Link href={href} className="text-accent-cyan hover:underline">
      {linkText}
    </Link>
  </p>
);
