import { TEMPORAL_CONCEPTIONS } from "../utils/constants.js";
import { Utils } from "../utils/helpers.js";

export class AsciiVisualizer {
  constructor() {
    this.isAnimating = false;
  }

  generateCircularVisualization(data) {
    // Esta función es para la animación nueva
    const width = 50,
      height = 21,
      centerX = 24,
      centerY = 10,
      radius = 9;
    const grid = Array(height)
      .fill()
      .map(() => Array(width).fill(" "));
    for (let angle = 0; angle < 360; angle += 5) {
      const radians = (angle * Math.PI) / 180;
      const x = Math.round(centerX + radius * Math.cos(radians) * 1.9);
      const y = Math.round(centerY + radius * Math.sin(radians));
      if (grid[y] && grid[y][x] !== undefined) {
        grid[y][x] = "·";
      }
    }
    return grid.map((row) => row.join("")).join("\n");
  }

  generateRhizomaticVisualization(data) {
    const { nodes = [], connections = [] } = data;
    const width = 50,
      height = 20;
    const grid = Array(height)
      .fill()
      .map(() => Array(width).fill(" "));
    const nodePositions = nodes.map((node) => ({
      x: Utils.random(2, width - 3),
      y: Utils.random(1, height - 2),
      ...node,
    }));
    connections.forEach((conn) => {
      if (conn.from < nodePositions.length && conn.to < nodePositions.length) {
        const from = nodePositions[conn.from];
        const to = nodePositions[conn.to];
        if (from && to) this.drawLine(grid, from.x, from.y, to.x, to.y);
      }
    });
    nodePositions.forEach((node) => {
      if (grid[node.y]) grid[node.y][node.x] = "●";
    });
    return grid.map((row) => row.join("")).join("\n");
  }

  generateLayeredVisualization(data) {
    const { layers = [] } = data;
    return layers
      .map((layer) => {
        const opacity = layer.opacity || 0.5;
        const char = opacity > 0.7 ? "█" : opacity > 0.4 ? "▓" : "░";
        const prefix = char.repeat(Math.floor(opacity * 15));
        return `${prefix} ${layer.content}`;
      })
      .join("\n");
  }

  drawLine(grid, x1, y1, x2, y2, char = "·") {
    const dx = Math.abs(x2 - x1),
      dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1,
      sy = y1 < y2 ? 1 : -1;
    let err = dx - dy,
      x = x1,
      y = y1;
    while (true) {
      if (grid[y] && grid[y][x] === " ") grid[y][x] = char;
      if (x === x2 && y === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  async animateVisualization(container, conception, data, duration = 4000) {
    this.isAnimating = true;
    const pre = document.createElement("pre");
    pre.className = `ascii-visualization ${conception.id}`;
    pre.style.whiteSpace = "pre";
    container.appendChild(pre);
    const steps = 120;
    const stepTime = duration / steps;

    if (conception.id === TEMPORAL_CONCEPTIONS.CIRCULAR.id) {
      const circlePoints = [];
      const width = 50,
        height = 21,
        centerX = 24,
        centerY = 10,
        radius = 9;
      for (let angle = 0; angle < 360; angle += 5) {
        const radians = (angle * Math.PI) / 180;
        const x = Math.round(centerX + radius * Math.cos(radians) * 1.9);
        const y = Math.round(centerY + radius * Math.sin(radians));
        if (!circlePoints.some((p) => p.x === x && p.y === y)) {
          circlePoints.push({ x, y });
        }
      }
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const pointsToShow = Math.floor(progress * circlePoints.length);
        const grid = Array(height)
          .fill()
          .map(() => Array(width).fill(" "));
        for (let j = 0; j < pointsToShow; j++) {
          const p = circlePoints[j];
          if (grid[p.y] && grid[p.y][p.x]) grid[p.y][p.x] = "·";
        }
        pre.textContent = grid.map((row) => row.join("")).join("\n");
        await Utils.delay(stepTime);
      }
    } else {
      let generator;
      switch (conception.id) {
        case TEMPORAL_CONCEPTIONS.RHIZOMATIC.id:
          generator = this.generateRhizomaticVisualization;
          break;
        case TEMPORAL_CONCEPTIONS.LAYERED.id:
          generator = this.generateLayeredVisualization;
          break;
        default:
          generator = (d) => JSON.stringify(d, null, 2);
      }
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        let progressiveData;
        switch (conception.id) {
          case TEMPORAL_CONCEPTIONS.RHIZOMATIC.id:
            progressiveData = {
              ...data,
              connections: data.connections.slice(
                0,
                Math.floor(progress * data.connections.length)
              ),
            };
            break;
          case TEMPORAL_CONCEPTIONS.LAYERED.id:
            progressiveData = {
              ...data,
              layers: data.layers.slice(
                0,
                Math.floor(progress * data.layers.length)
              ),
            };
            break;
          default:
            progressiveData = data;
        }
        pre.textContent = generator.call(this, progressiveData);
        await Utils.delay(stepTime);
      }
    }
    this.isAnimating = false;
  }
}
