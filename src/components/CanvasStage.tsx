import { Stage, Layer, Rect, Transformer } from "react-konva";
import ShapeRenderer from "./ShapeRenderer";
import type { CanvasStageProps } from "../types";

export default function CanvasStage({
  items,
  setIsStageFocused,
  isDraggable,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onShapeDragEnd,
  onShapeClick,
  updateText,
  stageRef,
  transformerRef,
}: CanvasStageProps) {
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onFocus={() => setIsStageFocused(true)}
      onBlur={() => setIsStageFocused(false)}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          height={window.innerHeight}
          width={window.innerWidth}
          fill={"#ffffff"}
          onClick={() => transformerRef.current?.nodes([])}
        />
        <ShapeRenderer
          items={items}
          isDraggable={isDraggable}
          onDragEnd={onShapeDragEnd}
          onClick={onShapeClick}
          updateText={updateText}
          transformerRef={transformerRef}
        />
        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  );
}
