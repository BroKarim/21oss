export default async function ResourcePage() {
  return (
    <div className="min-h-screen bg-background/50 flex flex-1 flex-col items-center  py-10 px-4 md:px-8">
      <div className="w-full max-w-3xl space-y-10 text-center">
        <div className="space-y-4 flex items-center flex-col">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-4">The Foundation for your Design System</h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">Discover the colors behind any website. Generate a full theme palette and bring it to life instantly with seamless Shadcn theme integration.</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">{/* CONTENT */}</div>
    </div>
  );
}
