import { useState, useRef, useCallback } from "react";
import type { EditableText } from "./types";
import { Text } from "react-konva";
import TextEditing from "./TextEditing";
import type Konva from "konva";

export default function EditableText({
  id,
  text,
  draggable,
  onDragEnd,
  onClick,
  onChangeText,
  ...props
}: EditableText) {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<Konva.Text>(null);

  const handleTextDblClick = useCallback(() => {
    const transformer = textRef.current?.getLayer()?.findOne("Transformer") as Konva.Transformer;
    if (transformer) transformer.nodes([]);
    setIsEditing(true);
  }, []);

  const handleTransformEnd = useCallback(() => {
    const node = textRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = Math.max(20, node.width() * scaleX);
    const newFontSize = Math.max(12, Math.floor(node.fontSize() * scaleY));

    // 見た目サイズを維持してスケールリセット
    node.fontSize(newFontSize);
    node.width(newWidth);
    node.scaleX(1);
    node.scaleY(1);

    node.getLayer()?.batchDraw();

    if (text !== undefined) {
      onChangeText(text, id, { width: newWidth, fontSize: newFontSize });
    }
  }, [id, text, onChangeText]);

  return (
    <>
      <Text
        id={id}
        ref={textRef}
        text={text}
        {...props}
        draggable={draggable}
        onDragEnd={onDragEnd}
        onClick={onClick}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
        visible={!isEditing}
        onTransformEnd={handleTransformEnd}
      />
      {isEditing && textRef.current && (
        <TextEditing
          textNode={textRef.current}
          onChange={onChangeText}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
