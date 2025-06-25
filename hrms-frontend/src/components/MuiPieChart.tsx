import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function MuiPieChart({data}:any) {
  return (
    <PieChart
      series={[
        {
        arcLabel: (item:any) => `${item.value}%`,
        arcLabelMinAngle: 35,
          arcLabelRadius: '60%',
          data: data,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          valueFormatter,
        },
      ]}
      height={200}
    />
  );
}
  
export const valueFormatter = (item: { value: number }) => `${item.value}%`;