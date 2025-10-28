import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";

export type Shapetype = "rect" | "circle" | "text";

export type StageItem = {
  id: string;
  type: Shapetype;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fillColor?: string;
  fill?: string;
  draggable?: boolean;
};

export type ToolbarProps = {
  fillColor: string;
  fontSize: number;
  onActionChange: (action: string) => void;
  onFillChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFontSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CanvasStageProps = {
  items: StageItem[];
  setIsStageFocused: (isFocused: boolean) => void;
  isDraggable: boolean;
  onPointerDown: (e: Konva.KonvaEventObject<PointerEvent>) => void;
  onPointerMove: (e: Konva.KonvaEventObject<PointerEvent>) => void;
  onPointerUp: (e: Konva.KonvaEventObject<PointerEvent>) => void;
  onShapeDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string) => void;
  onShapeClick: (e: Konva.KonvaEventObject<PointerEvent>) => void;
  updateText: (
    newText: string,
    id: string,
    updates?: { width?: number; fontSize?: number }
  ) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
  transformerRef: React.RefObject<Konva.Transformer | null>;
};

export type ShapeRendererProps = {
  items: StageItem[];
  isDraggable: boolean;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string) => void;
  onClick: (e: Konva.KonvaEventObject<PointerEvent>) => void;
  updateText: (
    key: string,
    newText: string,
    updates?: { width?: number; fontSize?: number }
  ) => void;
  transformerRef: React.RefObject<Konva.Transformer | null>;
};

export type EditableText = StageItem & {
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onClick: (e: KonvaEventObject<PointerEvent>) => void;
  onChangeText: (
    key: string,
    newText: string,
    updates?: {
      width?: number;
      fontSize?: number;
    }
  ) => void;
  transformerRef: React.RefObject<Konva.Transformer | null>;
};

export type TextEditing = {
  textNode: Konva.Text;
  onChange: (newText: string, id: string) => void;
  onClose: () => void;
};
