import "./globals.css";

export const metadata = {
  title: "What to Wear",
  description: "An editorial fashion closet app."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
