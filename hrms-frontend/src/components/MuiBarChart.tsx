import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function MuiBarChart({ data, series }: any) {
  const [tickPlacement, setTickPlacement] = React.useState<
    "start" | "end" | "middle" | "extremities"
  >("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState<
    "middle" | "tick"
  >("middle");

  const chartSetting = {
    yAxis: [
      {
        label: "",
        width: 60,
      },
    ],
    series: series,
    height: 300,
  };

  // console.log("data got from payroll summary", data);

  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={data}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "label",
            tickPlacement,
            tickLabelPlacement,
          },
        ]}
        {...chartSetting}
        slotProps={{
          legend: { hidden: true },
        }}
      />
    </div>
  );
}
