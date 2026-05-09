import "./globals.css";
import RefreshRedirect from '@/components/RefreshRedirect'

export const metadata = {
  title: "Emirhan Arıkan",
  description: "AI & Data Engineering Student - Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RefreshRedirect />
        {children}
        </body>
    </html>
  );
}