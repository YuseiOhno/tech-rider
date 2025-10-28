import { Html } from "react-konva-utils";
import { useLayoutEffect, useRef } from "react";
import type { TextEditing } from "../types";

export default function TextEditing({ textNode, onChange, onClose }: TextEditing) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.focus();
      textarea.value = textNode.text();

      const handleBlur = () => {
        onChange(textarea.value, textNode.id());
        onClose();
      };
      textarea.addEventListener("blur", handleBlur);

      return () => {
        cancelAnimationFrame(id);
        textarea.removeEventListener("blur", handleBlur);
      };
    });
  }, [textNode, onChange, onClose]);

  return (
    <Html
      key={textNode.id()}
      groupProps={{
        x: textNode.x(),
        y: textNode.y(),
        rotation: textNode.rotation(),
      }}
    >
      <textarea
        ref={textareaRef}
        style={{
          fontSize: `${textNode.fontSize()}px`,
          lineHeight: textNode.lineHeight().toString(),
          fontFamily: textNode.fontFamily(),
          color: textNode.fill().toString(),
          border: "none",
          background: "none",
          outline: "none",
          resize: "none",
          overflow: "hidden",
          transformOrigin: "left top",
          width: `${textNode.width()}px`,
          height: `${textNode.height()}px`,
        }}
      />
    </Html>
  );
}
