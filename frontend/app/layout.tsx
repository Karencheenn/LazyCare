import type { Metadata } from "next";
import ClientLayout from "./components/clientLayout";
import "./styles/global.css";

export const metadata: Metadata = {
  title: "Lazy Care",
  description: "An AI health assistant",
  icons: {
    icon: "/images/LazyCare.png", // 这里设置你的 favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/LazyCare.png" type="image/png" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
