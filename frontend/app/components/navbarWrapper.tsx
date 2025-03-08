"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper({ setDeleteModalOpen }: { setDeleteModalOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) return null;

  return <Navbar setDeleteModalOpen={setDeleteModalOpen} />;
}
