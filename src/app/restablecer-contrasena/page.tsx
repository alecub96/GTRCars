import ResetPasswordForm from '@/components/ResetPasswordForm';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F1EA] p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
