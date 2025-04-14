declare module 'heatmap.js' {
  interface HeatmapConfiguration {
    container: HTMLElement;
    radius?: number;
    maxOpacity?: number;
    minOpacity?: number;
    blur?: number;
    backgroundColor?: string;
    gradient?: { [key: string]: string };
  }

  interface HeatmapData {
    max?: number;
    min?: number;
    data: Array<{
      x: number;
      y: number;
      value: number;
    }>;
  }

  interface Heatmap {
    setData: (data: HeatmapData) => void;
    addData: (data: HeatmapData) => void;
    getData: () => HeatmapData;
    repaint: () => void;
    getValueAt: (point: { x: number; y: number }) => number;
  }

  interface HeatmapConstructor {
    create: (config: HeatmapConfiguration) => Heatmap;
  }

  const h337: HeatmapConstructor;
  export default h337;
}
