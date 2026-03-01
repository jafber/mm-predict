export default function PredictionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-3/4" />

      <div className="h-[180px] bg-gray-100 rounded w-full" />

      <div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
        <div className="h-[350px] bg-gray-100 rounded" />
      </div>
    </div>
  );
}
