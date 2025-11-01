# 🔍 Zoom & Pan Guide

## ✨ Overview

Your Stakeholder Relationship Map now supports **smooth zoom and pan** functionality, allowing you to navigate large relationship maps with ease.

---

## 🎯 Zoom Features

### **Mouse Wheel Zoom**
- **Scroll up** → Zoom in
- **Scroll down** → Zoom out
- Zoom centers on cursor position
- Smooth incremental steps (0.1 per scroll)

### **Trackpad Pinch**
- **Pinch out** → Zoom in
- **Pinch in** → Zoom out
- Natural gesture support on Mac/Windows trackpads

### **Toolbar Buttons**
Located in the **top-right corner**:
- **➖ (Minus)** - Zoom out
- **➕ (Plus)** - Zoom in  
- **⟳ (Reset)** - Reset to 100% zoom

---

## 🎮 Pan Features

### **Mouse Drag**
- **Click and drag** empty canvas space to pan
- Works at any zoom level
- Smooth momentum scrolling

### **Automatic Panning**
- Panning disabled while connecting stakeholders
- Re-enables after connection complete

---

## 📊 Zoom Limits

| Property | Value |
|----------|-------|
| **Default** | 100% (1.0x) |
| **Minimum** | 50% (0.5x) |
| **Maximum** | 200% (2.0x) |
| **Step Size** | 10% (0.1x) |

---

## 🎨 Visual Design

### **Zoom Controls Styling**
```css
Position: Absolute top-right
Background: #24292E (Manjaro Surface)
Border: 1px solid #3E454B (Border)
Text Color: #E8EDED (Text)
Hover: #2E343A (Light)
Active: Ring glow in Manjaro Mint
```

### **Button Layout**
```
┌─────────────────┐
│  ➖  ➕  ⟳     │  ← Top right corner
└─────────────────┘
```

---

## 💡 How to Use

### **Exploring Large Maps**

1. **Zoom out** to see the entire relationship network
2. **Pan** to navigate to a specific area
3. **Zoom in** to focus on details
4. **Reset** to return to default view

### **Creating Connections While Zoomed**

1. Zoom to comfortable level
2. Click connection dot
3. Drag to target (panning disabled automatically)
4. Release to create connection
5. Panning re-enables

### **Dragging Nodes While Zoomed**

1. Works at any zoom level
2. Positions stored in absolute coordinates
3. No recalculation needed
4. Smooth at all zoom levels

---

## 🔧 Technical Details

### **Library Used**
- `react-zoom-pan-pinch` v3.4.0
- Lightweight, performant, React-friendly
- GPU-accelerated transforms

### **Implementation**
```tsx
<TransformWrapper
  initialScale={1}
  minScale={0.5}
  maxScale={2}
  wheel={{ step: 0.1 }}
  doubleClick={{ disabled: true }}
  panning={{ disabled: isConnecting }}
>
  <TransformComponent>
    <YourCanvasContent />
  </TransformComponent>
</TransformWrapper>
```

### **Performance Optimizations**
- `will-change: transform` for smooth rendering
- GPU-accelerated CSS transforms
- Debounced wheel events
- Efficient re-render handling

---

## 🎯 Interaction Matrix

| Action | Zoom Level | Pan Enabled | Drag Nodes | Connect Nodes |
|--------|-----------|-------------|------------|---------------|
| Default | 100% | ✅ Yes | ✅ Yes | ✅ Yes |
| Zoomed In | 50-200% | ✅ Yes | ✅ Yes | ✅ Yes |
| Connecting | Any | ❌ No | ❌ No | ✅ Yes |
| Dragging Node | Any | ❌ No | ✅ Yes | ❌ No |

---

## 🐛 Troubleshooting

### **Zoom not working?**
→ Make sure you're hovering over the canvas, not the toolbar

### **Can't pan?**
→ Check if you're in connection mode (panning auto-disables)

### **Nodes jump when zoomed?**
→ This shouldn't happen - positions are in absolute coordinates

### **Connections offset after zoom?**
→ Clear browser cache and reload

### **Double-click zooms?**
→ Disabled by default - check Canvas.tsx settings

---

## ⌨️ Keyboard Shortcuts (Future)

Potential shortcuts you could add:

| Key | Action |
|-----|--------|
| `+` or `=` | Zoom in |
| `-` or `_` | Zoom out |
| `0` | Reset zoom |
| `Space + Drag` | Pan canvas |
| `Ctrl + Scroll` | Zoom (alternative) |

---

## 📱 Mobile Support

### **Touch Gestures**
- **Pinch** - Zoom in/out
- **Two-finger drag** - Pan
- **Tap** - Select node
- **Long press** - Edit node (double-tap alternative)

### **Toolbar Always Accessible**
- Fixed position on mobile
- Large touch targets
- No overlap with content

---

## 🎨 Customization

### **Change Zoom Limits**
Edit `Canvas.tsx`:
```tsx
<TransformWrapper
  minScale={0.25}  // 25% minimum
  maxScale={4}     // 400% maximum
  wheel={{ step: 0.2 }}  // Larger steps
>
```

### **Disable Wheel Zoom**
```tsx
<TransformWrapper
  wheel={{ disabled: true }}
>
```

### **Enable Double-Click Zoom**
```tsx
<TransformWrapper
  doubleClick={{ disabled: false, step: 0.5 }}
>
```

---

## 🚀 Performance Tips

### **For Large Maps (100+ nodes)**
- Use `limitToBounds={false}` for infinite canvas
- Consider lazy rendering for off-screen nodes
- Debounce position updates

### **For Smooth Experience**
- Keep node count reasonable (<200)
- Optimize connection line rendering
- Use `requestAnimationFrame` for animations

---

## 🔄 State Persistence

### **Current Implementation**
- Zoom level **NOT persisted** (resets to 100% on refresh)
- Pan position **NOT persisted** (resets to center)
- Node positions **ARE persisted** in localStorage

### **Optional: Persist Zoom**
Add to `useLocalStorage`:
```tsx
const [zoom, setZoom] = useLocalStorage('canvasZoom', 1);
const [pan, setPan] = useLocalStorage('canvasPan', { x: 0, y: 0 });
```

Then pass to TransformWrapper:
```tsx
<TransformWrapper
  initialScale={zoom}
  initialPositionX={pan.x}
  initialPositionY={pan.y}
  onTransformed={(ref) => {
    setZoom(ref.state.scale);
    setPan({ x: ref.state.positionX, y: ref.state.positionY });
  }}
>
```

---

## ✅ Implementation Checklist

- [x] Mouse wheel zoom in/out
- [x] Toolbar buttons (+, -, reset)
- [x] Trackpad pinch support
- [x] Pan with mouse drag
- [x] Zoom limits (0.5x - 2.0x)
- [x] Smooth animations
- [x] Manjaro design consistency
- [x] Drag nodes while zoomed
- [x] Connect nodes while zoomed
- [x] Auto-disable pan when connecting
- [x] GPU-accelerated rendering

---

## 📚 Related Documentation

- [DOT_CONNECTIONS_GUIDE.md](file:///c:/Users/User1/Documents/stakeholder/DOT_CONNECTIONS_GUIDE.md) - Connection system
- [QUICKSTART.md](file:///c:/Users/User1/Documents/stakeholder/QUICKSTART.md) - Getting started
- [react-zoom-pan-pinch docs](https://github.com/BetterTyped/react-zoom-pan-pinch)

---

**Navigate your stakeholder maps with ease!** 🔍✨
