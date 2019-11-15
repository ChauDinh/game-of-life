import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const totalRows = 50;
const totalColumns = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < totalRows; i++) {
    rows.push(Array.from(Array(totalColumns), () => 0));
  }

  return rows;
};

const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < totalRows; i++) {
    rows.push(
      Array.from(Array(totalColumns), () => (Math.random() > 0.5 ? 1 : 0))
    );
  }
  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRuning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    // Simulate
    setGrid(currentGrid => {
      return produce(currentGrid, gridCopy => {
        for (let i = 0; i < totalRows; i++) {
          for (let j = 0; j < totalColumns; j++) {
            // Determine the neightbors
            let neightbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < totalRows && newJ < totalColumns) {
                neightbors += currentGrid[newI][newJ];
              }
            });

            // Checking the neightbors
            if (neightbors < 2 || neightbors > 3) {
              gridCopy[i][j] = 0;
            } else if (currentGrid[i][j] === 0 && neightbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRuning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button onClick={() => setGrid(generateRandomGrid())}>random</button>
      <button onClick={() => setGrid(generateEmptyGrid())}>clear</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${totalColumns}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: grid[i][j] ? "black" : undefined,
                border: "1px solid pink"
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
};

export default App;
