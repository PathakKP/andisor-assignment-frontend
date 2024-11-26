"use client";

import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center gap-4">
        <Image
          src="/andisor_logo.jpeg"
          alt="Logo"
          width={50}
          height={50}
          className="object-contain"
        />
        <h1 className="text-xl font-semibold">Inventory Management</h1>
      </div>
    </header>
  );
}
