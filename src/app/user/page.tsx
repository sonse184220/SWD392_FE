import Banner from "@/components/Banner/Banner";
import Companies from '@/components/Companies/Companies';
import Buyers from "@/components/Buyers";
import Provide from "@/components/Provide";
import Why from "@/components/Why";
import Network from "@/components/Network";
import Clientsay from "@/components/Clientsay";

export function UserPage() {
    return (
        <main>
            <Banner />
            <Companies />
            <Buyers />
            <Provide />
            <Why />
            <Network />
            <Clientsay />
        </main>
    );
}
