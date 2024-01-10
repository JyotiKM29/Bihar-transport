import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "./components/ui/toaster";
import { ReduxProvider } from './redux/ReduxProvider';

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Bihar Transport",
  description: "Bihar Transport is an service provider for both B2B and B2C",
};

export default function RootLayout({ children }) {
  return (

    <ReduxProvider>

    <html lang="en">
      <body className={poppins.className}>
    
        <main>{children}</main>

        <Toaster />
      </body>
    </html>
    </ReduxProvider>
  );
}
