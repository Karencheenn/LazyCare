import type { Metadata } from "next";
import ClientLayout from "./components/clientLayout";
import "./styles/global.css";

export const metadata: Metadata = {
  title: "Lazy Care",
  description: "An AI health assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
