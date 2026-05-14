import { signOut } from "lib/auth";

export function SignOutButton({
  className,
  label = "Se déconnecter",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className={
          className ??
          "rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-50"
        }
      >
        {label}
      </button>
    </form>
  );
}
