import type { Metadata } from "next"
import ClientAccount from "./ClientAccount"
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Account | Shopcart",
  description: "Manage your account settings and preferences",
}

export default function AccountPage() {
  return(
    <>
      <ClientAccount />
      <Footer />
    </>
  );
}
