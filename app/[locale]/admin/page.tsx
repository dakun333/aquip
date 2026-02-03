import { Button } from "@/components/ui/button";
import { ArrowRightIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-center gap-4 flex flex-col">
        <h2 className="text-2xl font-bold">Aquippay Admin</h2>
        <p>Welcome to Aquippay Admin</p>

        <Link href="/">
          <Button variant="outline">
            Enter
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
