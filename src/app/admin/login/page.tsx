import { signOut } from "../actions";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-bold">Admin sign in</h1>
      {error === "not-admin" ? (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm">
          <p>You&apos;re signed in, but this account isn&apos;t the admin.</p>
          <form action={signOut}>
            <button className="font-semibold underline">Sign out</button>
          </form>
        </div>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
