import { createSignal, Show, createEffect } from "solid-js";

interface PasswordProtectionProps {
  password: string | undefined;
  slug: string;
  children: any;
}

export default function PasswordProtection({
  password,
  slug,
  children,
}: PasswordProtectionProps) {
  // Check if password protection is needed
  const hasPassword = Boolean(
    password && typeof password === "string" && password.trim() !== ""
  );

  // If no password, render children directly (no protection needed)
  if (!hasPassword) {
    return <>{children}</>;
  }

  // Password protection UI
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isChecking, setIsChecking] = createSignal(true);
  const [passwordInput, setPasswordInput] = createSignal("");
  const [error, setError] = createSignal("");

  const storageKey = `case-study-auth-${slug}`;

  // Use createEffect to check auth after hydration
  createEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      const authStatus = sessionStorage.getItem(storageKey);
      if (authStatus === "authenticated") {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setError("");

    if (passwordInput().trim() === "") {
      setError("Please enter a password");
      return;
    }

    if (passwordInput() === password) {
      setIsAuthenticated(true);
      sessionStorage.setItem(storageKey, "authenticated");
      setPasswordInput("");
    } else {
      setError("Incorrect password");
      setPasswordInput("");
    }
  };

  // Show password form during initial check (prevents hydration mismatch)
  return (
    <>
      <Show when={isAuthenticated()} fallback={
        <>
          <div class="relative z-2 flex items-center justify-center min-h-full">
            <div class="lg:rounded-xxl bg-primary text-inverted relative z-2 mx-auto lg:w-920 lg:px-64 lg:py-54 max-lg:px-margin-1 py-40">
              <div class="flex flex-col items-center gap-32">
                <h2 class="text-32 font-display font-medium">Password Protection</h2>
                <p class="text-16 opacity-80 text-center">
                  This case study is password protected. Please enter the password to
                  continue.
                </p>
                <form
                  onSubmit={handleSubmit}
                  class="flex flex-col gap-16 w-full max-w-[400px]"
                >
                  <input
                    type="password"
                    value={passwordInput()}
                    onInput={(e) => setPasswordInput(e.currentTarget.value)}
                    placeholder="Enter password"
                    class="px-24 py-16 rounded-md bg-[#70706E] border border-[#0D0D0D]/25 text-[white] placeholder:text-[white]/60 focus:outline-none focus:ring-2 focus:ring-[white]/20"
                    autofocus
                    disabled={isChecking()}
                  />
                  <Show when={error()}>
                    <p class="text-14 text-red-400">{error()}</p>
                  </Show>
                  <button
                    type="submit"
                    class="py-16 px-40 rounded-md flex-center inline-flex text-14 cursor-pointer text-center border border-[#0D0D0D]/25 font-medium bg-[#70706E] text-[white] hover:bg-[#70706E]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isChecking()}
                  >
                    {isChecking() ? "Loading..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div
            class="fixed inset-0 z-1 size-full bg-[black]/30 lg:backdrop-blur-xs"
            style="pointer-events: none;"
          ></div>
        </>
      }>
        {children}
      </Show>
    </>
  );
}
