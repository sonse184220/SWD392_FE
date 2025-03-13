"use client"
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
import AdminLayout from "./layout";

export default function Admin() {
    return (
        <main>
            <AdminLayout>
                <DefaultLayout>
                    <ECommerce />
                </DefaultLayout>
            </AdminLayout>
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
