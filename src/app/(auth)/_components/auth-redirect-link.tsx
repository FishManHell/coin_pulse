import Link from "next/link";

interface AuthRedirectLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export const AuthRedirectLink = ({ text, linkText, href }: AuthRedirectLinkProps) => (
  <p className="text-center text-text-muted text-sm mt-6">
    {text}{" "}
    <Link href={href} className="text-accent-cyan hover:underline">
      {linkText}
    </Link>
  </p>
);
