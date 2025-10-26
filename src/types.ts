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
};

export type TextEditing = {
  textNode: Konva.Text;
  onChange: (newText: string, id: string) => void;
  onClose: () => void;
};
