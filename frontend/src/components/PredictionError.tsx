type Props = { error: string };

export default function PredictionError({ error }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3">
      {error}
    </div>
  );
}
