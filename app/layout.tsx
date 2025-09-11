export const metadata = {
  title: "UnflakeOps — Cut Failed Builds by 50%+ in 30 Days. Guaranteed.",
  description:
    "PASS/WARN/FAIL release gates, fewer flaky tests, faster cycles for GitHub Actions & GitLab CI. UK/EU GDPR-friendly.",
};
import "../styles/globals.css";
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
