import React from 'react';
import { IGroup } from '../../types';
import Chart from 'chart.js/auto';
import './GamesChartDiagram.scss';

interface GamesChartDiagramProps {
  groupState: IGroup;
}

export const GamesChartDiagram = ({ groupState }: GamesChartDiagramProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const gameCount: Record<string, number> = groupState.parties.reduce(
    (acc: Record<string, number>, party) => {
      const { gameName } = party;
      acc[gameName] = (acc[gameName] || 0) + 1;
      return acc;
    },
    {}
  );

  const labels: string[] = Object.keys(gameCount);
  const data: number[] = Object.values(gameCount);

  const totalParties = data.reduce((acc, count) => acc + count, 0); // Загальна кількість партій

  React.useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels.map((label, index) => {
              const percentage = ((data[index] / totalParties) * 100).toFixed(1); // Розрахунок відсотків
              const totalPlayGame = data[index];
              return `${label.slice(0, 20)} (${totalPlayGame}), ${percentage}%`; // Додаємо кількість партій у відсотках до лейблів
            }),
            datasets: [
              {
                data: data,
                backgroundColor: [
                  '#175174',
                  '#E9AB0E',
                  '#DA3C4B',
                  '#004242',
                  '#09859F',
                  '#08C5A8',
                  '#EA7C16',
                  '#891C43',
                  '#7FB408',
                  '#9457EB',
                  '#006262',
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            },
            plugins: {
              legend: {
                position: 'right', // Встановлюємо позицію легенди
              },
            },
          },
        });

        // Знищення графіка перед створенням нового
        return () => {
          myChart.destroy();
        };
      }
    }
  }, [groupState.parties]);
  return (
    <div className="games-diagram">
      <h5>Зіграно ігр</h5>
      <canvas ref={canvasRef} id="myChart" />
    </div>
  );
};
