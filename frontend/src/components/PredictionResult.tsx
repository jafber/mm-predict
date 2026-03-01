import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PredictionResponse } from "../types";

type Props = { prediction: PredictionResponse };

interface ChartDataPoint {
  time: number;
  risk: number;
  ci_lower: number;
  ci_band: number;
}

function interpolate(
  times: number[],
  values: number[],
  target: number
): number | null {
  if (target < times[0] || target > times[times.length - 1]) return null;
  for (let i = 0; i < times.length - 1; i++) {
    if (times[i] <= target && times[i + 1] >= target) {
      const t = (target - times[i]) / (times[i + 1] - times[i]);
      return values[i] + t * (values[i + 1] - values[i]);
    }
  }
  return values[values.length - 1];
}

function getRiskLevel(risk: number) {
  if (risk < 0.1)
    return { label: "Low", className: "text-green-700 font-bold" };
  if (risk < 0.2)
    return { label: "Moderate", className: "text-yellow-600 font-bold" };
  return { label: "High", className: "text-red-600 font-bold" };
}

export default function PredictionResult({ prediction }: Props) {
  const { time, risk, ci_lower, ci_upper } = prediction;

  const chartData: ChartDataPoint[] = time.map((t, i) => ({
    time: Number(t.toFixed(2)),
    risk: risk[i],
    ci_lower: ci_lower[i],
    ci_band: ci_upper[i] - ci_lower[i],
  }));

  const milestones = [1, 2, 5, 10];
  const tableRows = milestones
    .map((y) => ({ year: y, prob: interpolate(time, risk, y) }))
    .filter((r): r is { year: number; prob: number } => r.prob !== null);

  const twoYearRisk = interpolate(time, risk, 2);
  const riskLevel = twoYearRisk !== null ? getRiskLevel(twoYearRisk) : null;

  return (
    <div className="space-y-6">
      {riskLevel && (
        <p className="text-gray-800">
          According to the model, the patient has a{" "}
          <span className={riskLevel.className}>{riskLevel.label}</span>
          {twoYearRisk !== null && (
            <>
              {" "}
              (
              {twoYearRisk < 0.1
                ? "less than 10%"
                : `${(twoYearRisk * 100).toFixed(1)}%`}
              )
            </>
          )}{" "}
          risk of progressing to multiple myeloma in two years.
        </p>
      )}

      {tableRows.length > 0 && (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 font-semibold text-gray-900 w-0 whitespace-nowrap pr-6">
                Years in Future
              </th>
              <th className="text-left py-2 font-semibold text-gray-900">
                Probability of Progression
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(({ year, prob }) => (
              <tr key={year} className="border-b border-gray-200">
                <td className="py-2 text-gray-700 w-0 whitespace-nowrap pr-6">{year}</td>
                <td className="py-2 text-gray-700">
                  {(prob * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        <h3 className="text-center font-semibold text-gray-900 mb-4">
          Predicted Progression to Multiple Myeloma
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 25, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              type="number"
              domain={[0, "dataMax"]}
              label={{
                value: "Years in Future",
                position: "insideBottom",
                offset: -15,
              }}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1.0]}
              tickFormatter={(v: number) => v.toFixed(2)}
              label={{
                value: "Probability of Progression",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const entry = payload.find((p) => p.dataKey === "risk");
                if (!entry) return null;
                const point = entry.payload as ChartDataPoint;
                return (
                  <div className="bg-white border border-gray-200 px-3 py-2 rounded shadow">
                    <p className="font-medium">Year {point.time.toFixed(1)}</p>
                    <p style={{ color: "#dc2626" }}>
                      Risk: {(Number(entry.value) * 100).toFixed(1)}%
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="ci_lower"
              stackId="ci"
              fill="transparent"
              stroke="none"
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="ci_band"
              stackId="ci"
              fill="#d1d5db"
              stroke="none"
              fillOpacity={0.6}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
