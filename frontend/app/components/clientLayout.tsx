"use client";

import { useState } from "react";
import DeleteDataModal from "./deleteDataModal";
import NavbarWrapper from "./navbarWrapper";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * A top-level layout component that wraps all pages with a navbar and a delete-data
 * modal. The navbar is wrapped in a NavbarWrapper component, which shows the navbar
 * on all pages except the login page. The delete-data modal is shown when the user

/******  677f28da-771e-45f0-92a5-aa449f8d8121  *******/
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="app-container">
      <NavbarWrapper setDeleteModalOpen={setDeleteModalOpen} />
      <main className="main-content">{children}</main>
      <DeleteDataModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </div>
  );
}
