import { Rect, Circle } from "react-konva";
import EditableText from "./EditableText";
import type { ShapeRendererProps } from "../types";

export default function ShapeRenderer({
  items,
  isDraggable,
  onDragEnd,
  onClick,
  updateText,
  transformerRef,
}: ShapeRendererProps) {
  return (
    <>
      {items.map((item) => {
        switch (item.type) {
          case "rect":
            return (
              <Rect
                key={item.id}
                {...item}
                fill={item.fillColor}
                draggable={isDraggable}
                onDragEnd={(e) => {
                  onDragEnd(e, item.id);
                }}
                onClick={onClick}
              />
            );
          case "circle":
            return (
              <Circle
                key={item.id}
                {...item}
                fill={item.fillColor}
                draggable={isDraggable}
                onDragEnd={(e) => {
                  onDragEnd(e, item.id);
                }}
                onClick={onClick}
              />
            );
          case "text":
            return (
              <EditableText
                key={item.id}
                {...item}
                fill={item.fillColor}
                fontSize={item.fontSize}
                draggable={isDraggable}
                onDragEnd={(e) => {
                  onDragEnd(e, item.id);
                }}
                onClick={onClick}
                onChangeText={updateText}
                transformerRef={transformerRef}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
