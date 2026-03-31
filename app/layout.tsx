import "./globals.css";

export const metadata = {
  title: "Laundry Room",
  description: "Laundry Room App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <body className="min-h-full flex flex-col bg-white text-black m-0 p-0">
        {children}
      </body>
    </html>
  );
}