import "../styles/globals.css";

export const metadata = {
  title: "UnflakeOps — Cut Failed Builds by 50%+ in 30 Days. Guaranteed.",
  description:
    "PASS/WARN/FAIL release gates, fewer flaky tests, faster cycles for GitHub Actions & GitLab CI. UK/EU GDPR-friendly.",
};
const LOGO_URL = "/brand/unflakeops_icon_dots_dark_400.png"; // already fine
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
