import { ACTIONS } from "../constants";
import type { ToolbarProps } from "../types";

export default function Toolbar({
  fillColor,
  fontSize,
  onActionChange,
  onFillChange,
  onFontSizeChange,
}: ToolbarProps) {
  return (
    <div style={{ position: "fixed", zIndex: 10, padding: 12 }}>
      <button onClick={() => onActionChange(ACTIONS.SELECT)}>Select</button>
      <button onClick={() => onActionChange(ACTIONS.RECTANGLE)}>+ 矩形</button>
      <button onClick={() => onActionChange(ACTIONS.CIRCLE)}>+ 円</button>
      <button onClick={() => onActionChange(ACTIONS.TEXT)}>+ Text</button>
      <button>
        Fill
        <input type="color" value={fillColor} onChange={(e) => onFillChange(e)} />
      </button>
      <button>
        FontSize
        <input value={fontSize} onChange={(e) => onFontSizeChange(e)} />
      </button>
    </div>
  );
}
