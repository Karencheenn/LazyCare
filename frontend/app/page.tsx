import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lazy Care",
  description: "An AI health assistant",
};

export default function HomePage() {
  return (
    <div className="relative h-screen">
      <h6 className="page-title text-4xl font-bold">Welcome to Lazy Care!</h6>
    </div>
  );
}
