import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Transformer, Circle } from "react-konva";
import Konva from "konva";
import { v4 as uuid } from "uuid";
import type { StageItem } from "./types";
import { ACTIONS } from "./constants";
import EditableText from "./EditableText";

import "./App.css";

export default function App() {
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [items, setItems] = useState<StageItem[]>([]);
  const [fillColor, setFillColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(50);
  const [isStageFocused, setIsStageFocused] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isPainting = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const currentShapeId = useRef<string | null>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const isDraggable = action === ACTIONS.SELECT;

  const defaultSize = 100;
  const minSize = 100;

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;

    const id = uuid();

    currentShapeId.current = id;
    isPainting.current = true;

    if (action === ACTIONS.RECTANGLE) {
      setItems((prev) => [
        ...prev,
        {
          id,
          type: "rect",
          x,
          y,
          width: defaultSize,
          height: defaultSize,
          fillColor,
        },
      ]);
      requestAnimationFrame(() => attachTransformer(id));
      return;
    }

    if (action === ACTIONS.CIRCLE) {
      setItems((prev) => [
        ...prev,
        {
          id,
          type: "circle",
          x,
          y,
          radius: defaultSize / 2,
          fillColor,
        },
      ]);
      requestAnimationFrame(() => attachTransformer(id));
      return;
    }

    const count = items.filter((item) => item.type === "text").length;

    if (action === ACTIONS.TEXT) {
      setItems((prev) => [
        ...prev,
        {
          id,
          type: "text",
          text: `Text ${count + 1}`,
          fontSize,
          fillColor,
          x,
          y,
        },
      ]);
      requestAnimationFrame(() => attachTransformer(id));
      return;
    }
  };

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;

    if (action === ACTIONS.RECTANGLE) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== currentShapeId.current || item.type !== "rect") return item;

          const newWidth = minSize + (x - item.x);
          const newHeight = minSize + (y - item.y);

          return { ...item, width: newWidth, height: newHeight };
        })
      );
    }

    if (action === ACTIONS.CIRCLE) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== currentShapeId.current || item.type !== "circle") return item;

          const newRadius = minSize / 2 + Math.hypot(x - item.x, y - item.y) / 2;

          return { ...item, radius: newRadius };
        })
      );
    }
  };

  const onPointerUp = () => {
    isPainting.current = false;
    setAction(ACTIONS.SELECT);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    const { x, y } = e.target.position();
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, x, y } : it)));
  };

  const onClick = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget as Konva.Shape;
    const id = target.id();
    const tr = transformerRef.current;

    if (!tr || !id) return;

    if (e.evt.shiftKey) {
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setSelectedIds([id]);
    }
    const fillValue = target.fill?.();
    setFillColor(typeof fillValue === "string" ? fillValue : "#000000");
    setFontSize(target instanceof Konva.Text ? target.fontSize() : 50);
  };

  useEffect(() => {
    const stage = stageRef.current;
    const tr = transformerRef.current;
    if (!stage || !tr) return;

    const selectedNodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];
    tr.nodes(selectedNodes);
    tr.getLayer()?.batchDraw();
  }, [selectedIds]);

  const attachTransformer = (id: string) => {
    const stage = stageRef.current;
    const tr = transformerRef.current;
    if (!stage || !tr) return;

    const shape = stage.findOne(`#${id}`);
    if (shape) {
      tr.nodes([shape]);
      stage.batchDraw();
    }
  };

  const updateText = (
    newText: string,
    id: string,
    updates?: { width?: number; fontSize?: number }
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: newText, ...updates } : item))
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStageFocused) return;

      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isTyping = tagName === "input" || tagName === "textarea" || target.isContentEditable;

      if (isTyping) return;

      if (e.key === "Backspace" || e.key === "Delete") {
        const tr = transformerRef.current;
        if (!tr) return;

        const selectedNodes = tr.nodes();
        if (selectedNodes.length === 0) return;

        const node = selectedNodes[0];
        const id = node.id();
        if (!id) return;

        setItems((prev) => prev.filter((item) => item.id !== id));

        tr.nodes([]);
        tr.getLayer()?.batchDraw();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStageFocused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStageFocused) return;

      const tr = transformerRef.current;
      if (!tr) return;

      const selectedNodes = tr.nodes();
      if (selectedNodes.length === 0) return;
      const node = selectedNodes[0];
      const step = 1;

      switch (e.key) {
        case "ArrowUp":
          node.y(node.y() - step);
          setItems((prev) =>
            prev.map((item) => (item.id === node.id() ? { ...item, y: item.y - step } : item))
          );
          break;
        case "ArrowDown":
          node.y(node.y() + step);
          setItems((prev) =>
            prev.map((item) => (item.id === node.id() ? { ...item, y: item.y + step } : item))
          );
          break;
        case "ArrowLeft":
          node.x(node.x() - step);
          setItems((prev) =>
            prev.map((item) => (item.id === node.id() ? { ...item, x: item.x - step } : item))
          );
          break;
        case "ArrowRight":
          node.x(node.x() + step);
          setItems((prev) =>
            prev.map((item) => (item.id === node.id() ? { ...item, x: item.x + step } : item))
          );
          break;
        default:
          return;
      }
      node.getLayer()?.batchDraw();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStageFocused]);

  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tr = transformerRef.current;
    if (!tr) return;
    const node = tr.nodes()[0] as Konva.Shape | undefined;
    if (node) {
      node?.fill(e.target.value);
      node?.getLayer()?.batchDraw();
      setFillColor(e.target.value);
    } else {
      setFillColor(e.target.value);
    }
  };

  const changeFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const tr = transformerRef.current;
    if (!tr) return;
    const node = tr.nodes()[0];
    setFontSize(value);

    if (node instanceof Konva.Text) {
      node?.fontSize(value);
      node?.getLayer()?.batchDraw();
    }
  };

  useEffect(() => {
    const stage = stageRef.current;
    const tr = transformerRef.current;
    if (!stage || !tr) return;

    let isDraggingGroup = false;
    let lastPos = { x: 0, y: 0 };

    const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
      const trBox = tr.getClientRect();
      const pos = stage.getPointerPosition();
      if (!pos) return;

      if (
        pos.x >= trBox.x &&
        pos.x <= trBox.x + trBox.width &&
        pos.y >= trBox.y &&
        pos.y <= trBox.y + trBox.height
      ) {
        isDraggingGroup = true;
        lastPos = pos;
        e.evt.stopPropagation();
      }
    };

    const handlePointerMove = () => {
      if (!isDraggingGroup) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;

      const dx = pos.x - lastPos.x;
      const dy = pos.y - lastPos.y;

      tr.nodes().forEach((node) => {
        node.x(node.x() + dx);
        node.y(node.y() + dy);
      });

      tr.getLayer()?.batchDraw();
      lastPos = pos;
    };

    const handlePointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
      isDraggingGroup = false;
      e.evt.stopPropagation();
    };

    stage.on("pointerdown", handlePointerDown);
    stage.on("pointermove", handlePointerMove);
    stage.on("pointerup", handlePointerUp);

    return () => {
      stage.off("pointerdown", handlePointerDown);
      stage.off("pointermove", handlePointerMove);
      stage.off("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <>
      <div style={{ position: "fixed", zIndex: 10, padding: 12 }}>
        <button onClick={() => setAction(ACTIONS.SELECT)}>select</button>
        <button onClick={() => setAction(ACTIONS.RECTANGLE)}>+ 矩形</button>
        <button onClick={() => setAction(ACTIONS.CIRCLE)}>+ 円</button>
        <button onClick={() => setAction(ACTIONS.TEXT)}>+ Text</button>
        <button>
          fill
          <input type="color" value={fillColor} onChange={(e) => changeColor(e)} />
        </button>
        <button>
          fontsize
          <input value={fontSize} onChange={(e) => changeFontSize(e)} />
        </button>
      </div>

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
            onClick={() => {
              setSelectedIds([]);
            }}
          />
          {items.map((item) => {
            if (item.type === "rect")
              return (
                <Rect
                  key={item.id}
                  {...item}
                  fill={item.fillColor}
                  draggable={isDraggable}
                  onDragEnd={(e) => {
                    handleDragEnd(e, item.id);
                  }}
                  onClick={onClick}
                />
              );
            if (item.type === "circle")
              return (
                <Circle
                  key={item.id}
                  {...item}
                  fill={item.fillColor}
                  draggable={isDraggable}
                  onDragEnd={(e) => {
                    handleDragEnd(e, item.id);
                  }}
                  onClick={onClick}
                />
              );
            if (item.type === "text")
              return (
                <EditableText
                  key={item.id}
                  {...item}
                  fill={item.fillColor}
                  fontSize={item.fontSize}
                  draggable={isDraggable}
                  onDragEnd={(e) => {
                    handleDragEnd(e, item.id);
                  }}
                  onClick={onClick}
                  onChangeText={updateText}
                />
              );
          })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </>
  );
}
