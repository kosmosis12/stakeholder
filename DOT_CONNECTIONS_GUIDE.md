# 🔗 Dot-Based Connections Guide

## ✨ Overview

Your Stakeholder Relationship Map now features a **simple, elegant connection system** using clickable dots on each node. No complex hierarchy or auto-layouts—just pure, free-form relationship mapping.

---

## 🎯 Key Features

### ✅ **Simple Drag-and-Drop**
- Stakeholder cards are freely draggable anywhere on the canvas
- No restrictions, no grids, no auto-positioning
- Position updates save automatically to localStorage

### ✅ **Dot-Based Connections**
- Each stakeholder card has **two connection dots**:
  - **Left dot** (input) - for incoming connections
  - **Right dot** (output) - for outgoing connections
- Dots are **Manjaro Mint** (#34BE5B) colored
- Hover effect: **Cyan ring glow** (#00BFA6)

### ✅ **Interactive Connection Creation**
1. **Click and hold** on any connection dot
2. **Drag** toward another stakeholder
3. **Release** on the target dot to create connection
4. A smooth, curved mint line appears!

### ✅ **Connection Management**
- **Right-click any line** to delete it
- Lines dynamically follow nodes as you drag them
- All connections persist in localStorage
- Export/Import includes connection data

---

## 🎨 Visual Design

### Connection Dots
```css
Size: 12px diameter (3px w-3 h-3 in Tailwind)
Color: #34BE5B (Manjaro Mint)
Border: 2px solid #24292E (Surface)
Hover: Cyan ring glow
Position: Absolute, centered vertically on card edges
```

### Connection Lines
```css
Stroke: #34BE5B (Manjaro Mint)
Width: 3px
Style: Smooth curved (Bézier)
Effect: Drop shadow glow
Hover: Changes to #00BFA6 (Cyan)
```

### Temporary Line (while dragging)
```css
Stroke: #00BFA6 (Cyan)
Width: 2px
Style: Dashed (5,5)
Opacity: 0.7
Effect: Glowing shadow
```

---

## 💡 How to Use

### Creating Connections

1. **Add stakeholders** to the canvas
2. **Click and hold** on the right dot of one stakeholder
3. **Drag** your cursor to another stakeholder
4. **Release** on their left or right dot
5. Connection created! ✨

### Moving Stakeholders

- **Click anywhere** on a stakeholder card (not on dots)
- **Drag** to reposition
- Connected lines follow automatically

### Deleting Connections

- **Right-click** on any connection line
- Confirm deletion in browser prompt
- Connection removed instantly

### Editing Stakeholders

- **Double-click** any stakeholder card
- Modal opens with all details
- Edit or delete as needed

---

## 🏗️ Technical Architecture

### Component Structure

```
Canvas.tsx
├── SVG Layer (for connections)
│   ├── ConnectionLine (rendered connections)
│   └── TempConnectionLine (dragging preview)
└── StakeholderCard (draggable nodes)
    ├── Connection Dot (left)
    └── Connection Dot (right)
```

### State Management

```typescript
// In App.tsx
stakeholders: Stakeholder[]  // Node positions
connections: Connection[]     // Relationships

// Connection Interface
interface Connection {
  id: string;
  sourceId: string;   // Source stakeholder
  targetId: string;   // Target stakeholder
  account_id: string;
}
```

### Event Flow

1. **Mouse down on dot** → `onConnectionStart()`
2. **Mouse move** → Update temp line coordinates
3. **Mouse up on target dot** → `onConnectionEnd()` → Create connection
4. **Mouse up elsewhere** → Cancel connection

---

## 🎓 Best Practices

### ✅ Do's
- **Organize spatially** - Group related stakeholders together
- **Use role colors** - Leverage the color-coded badges
- **Connect intentionally** - Each line should mean something
- **Export regularly** - Save your relationship maps as JSON

### ❌ Don'ts
- **Avoid crossing lines** - Keep layouts clean for readability
- **Don't overcrowd** - Space out stakeholders for clarity
- **No circular connections** - Leads to confusion

---

## 🔧 Customization

### Changing Connection Colors

Edit `ConnectionLine.tsx`:
```typescript
stroke="#34BE5B"  // Change to your preferred color
```

### Adjusting Dot Size

Edit `StakeholderCard.tsx`:
```typescript
className="... w-3 h-3 ..."  // Change w-3/h-3 values
```

### Modifying Line Style

Edit `ConnectionLine.tsx`:
```typescript
strokeWidth="3"  // Thickness
type: 'curved'   // Curve style
```

---

## 📊 Use Cases

### **Sales Stakeholder Mapping**
- Connect decision-makers to their teams
- Visualize influence chains
- Track champion relationships

### **Organizational Charts**
- Show reporting lines
- Display cross-functional connections
- Map project dependencies

### **Network Analysis**
- Identify key connectors
- Find isolated stakeholders
- Spot communication bottlenecks

---

## 🐛 Troubleshooting

**Connection won't create?**
→ Make sure you're clicking on the dots (small circles), not the card itself

**Lines disappear when dragging?**
→ This is normal - they update when you release the node

**Can't delete a connection?**
→ Right-click directly on the line path, not near it

**Dots not visible?**
→ Zoom in or check if the card is overlapping another element

---

## 🚀 Performance Tips

- **Debounced saves** - Position updates batch to localStorage
- **SVG rendering** - Efficient line drawing with native browser support
- **Request animation frame** - Smooth drag interactions
- **Minimal re-renders** - React optimized with useCallback

---

## 📝 Data Structure Example

```json
{
  "connections": [
    {
      "id": "conn_1234567890",
      "sourceId": "sh_0987654321",
      "targetId": "sh_1122334455",
      "account_id": "acc_9988776655"
    }
  ]
}
```

---

## ✨ What Makes This Better

| Feature | Old React Flow | New Dot System |
|---------|---------------|----------------|
| **Complexity** | High (many dependencies) | Low (plain SVG) |
| **File Size** | +500KB | <10KB |
| **Learning Curve** | Steep | Instant |
| **Customization** | Limited | Full control |
| **Performance** | Good | Excellent |
| **Visual Match** | Partial | Perfect |

---

**Your stakeholder map is now simpler, faster, and perfectly styled!** 🎉
