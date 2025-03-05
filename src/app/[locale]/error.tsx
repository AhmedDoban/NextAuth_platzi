"use client";

function ErrorPage({ error }: { error: any }) {
  return (
    <div className="flex items-center justify-center gap-3 min-h-screen bg-black text-white text-center space-y-4">
      <p className="border-r-2 border-gray-500 pr-4 text-2xl font-medium">
        404
      </p>
      <h2 className="text-lg text-gray-400 pb-3">{error.message}</h2>
    </div>
  );
}

export default ErrorPage;
