import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-[#161515] bg-[url('../assets/grid-pattern.svg')] h-full bg-no-repeat bg-cover bg-center bg-fixed">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
