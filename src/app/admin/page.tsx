import { Metadata } from "next";
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Banner from "@/components/Banner/Banner";
import Companies from '@/components/Companies/Companies';
import Buyers from "@/components/Buyers";
import Provide from "@/components/Provide";
import Why from "@/components/Why";
import Network from "@/components/Network";
import Clientsay from "@/components/Clientsay";
import Newsletter from "@/components/Newsletter/Newsletter";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
    return (
        <main>
            <DefaultLayout>
                <ECommerce />
            </DefaultLayout>
            {/* <Banner />
      <Companies />
      <Buyers />
      <Provide />
      <Why />
      <Network />
      <Clientsay />
      <Newsletter /> */}
        </main>
    );
}
