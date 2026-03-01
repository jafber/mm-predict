export default function PredictionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4" />

      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-full" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 bg-gray-100 rounded w-full" />
        ))}
      </div>

      <div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
        <div className="h-[350px] bg-gray-100 rounded" />
      </div>
    </div>
  );
}
