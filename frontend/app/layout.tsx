import type { Metadata } from "next";
import ClientLayout from "./components/ClientLayout"; // 使用 Client Component 处理状态
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
