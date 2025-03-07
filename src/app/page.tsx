import UserLayout from "./user/layout";
import { UserPage } from "./user/page";

export default function Home() {
  return (
    <main>
      <UserLayout>
        <UserPage />
      </UserLayout>
    </main>
  );
}
