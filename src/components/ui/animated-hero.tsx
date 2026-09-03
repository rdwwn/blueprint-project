export function AnimatedHero() {
  return (
    <div className="w-full text-center">
      <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
        <span className="block bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Stop scrolling.
        </span>
        <span className="mt-2 block bg-primary bg-clip-text text-transparent">
          Start applying.
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
        Free internships, competitions, scholarships, and research programs for
        high school students. All verified by hand, all with real deadlines.
      </p>
    </div>
  );
}
