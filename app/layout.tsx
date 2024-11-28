import React from "react";
import "./styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="m-10 lg:mx-40">{children}</div>
      </body>
    </html>
  );
}
