# 🧠 Mind Map Features - Stakeholder Relationship Map

## ✨ New Capabilities

Your Stakeholder Relationship Map now supports **interactive, hierarchical mind-map connections** between stakeholder nodes!

---

## 🎯 Features Implemented

### 1️⃣ **Node-to-Node Connections**
- **Click + Drag** from one stakeholder node's connection handle to another to create relationships
- **Smooth animated curves** with Manjaro mint (`#34BE5B`) accent color
- **Delete connections** by selecting an edge and pressing `Delete` or `Backspace`
- **Connection handles** appear on all four sides (top, bottom, left, right) of each node

### 2️⃣ **Hierarchical Structure**
- Parent-child relationships automatically tracked in state
- Hierarchy data stored with each stakeholder (`parentId`, `childrenIds`)
- Use toolbar buttons to auto-arrange nodes based on hierarchy

### 3️⃣ **Layout Controls** (Top-right toolbar)
- **Horizontal Layout** - Arranges hierarchy left-to-right
- **Vertical Layout** - Arranges hierarchy top-to-bottom
- **Reset View** - Centers and fits all nodes in viewport

### 4️⃣ **Interactive Canvas**
- **Drag nodes** anywhere - positions auto-save to localStorage
- **Zoom** with mouse wheel or pinch gesture
- **Pan** by dragging the canvas background
- **Mini-map** shows bird's-eye view of entire canvas
- **Controls** for zoom in/out and fit view

### 5️⃣ **Smart Interactions**
- **Double-click node** to edit stakeholder details
- **Selected nodes** highlight with mint ring glow
- **Selected edges** glow with mint shadow effect
- **Hover over nodes** to see responsibilities and notes tooltip

### 6️⃣ **Data Persistence**
- All connections saved to localStorage automatically
- Export/Import includes connection data
- Relationships survive page refresh

---

## 🎨 Visual Design

All features maintain the **Manjaro color palette**:
- **Canvas Background**: Dark grid (`#1B1F23`) with subtle mint grid lines
- **Connection Lines**: Mint (`#34BE5B`) with smooth curves
- **Node Cards**: Unchanged - same dark surface with role-colored headers
- **Toolbar Buttons**: Dark surface with mint accents on interaction

---

## 🚀 How to Use

### Creating Connections
1. Add stakeholder nodes using the "Add Stakeholder" button
2. Hover over a stakeholder node - you'll see 4 connection handles (circles)
3. Click and drag from a handle to another node's handle
4. Release to create the connection

### Organizing with Layouts
1. Create parent-child relationships by connecting nodes
2. Click **"Horizontal Layout"** to arrange in left-to-right tree
3. Click **"Vertical Layout"** to arrange in top-to-bottom tree
4. Manually drag nodes to override auto-layout

### Navigation
- **Zoom**: Mouse wheel or trackpad pinch
- **Pan**: Drag canvas background or hold Space + drag
- **Fit View**: Click reset button or use Controls panel
- **Mini-Map**: Click to jump to different canvas areas

### Deleting Connections
1. Click on a connection line to select it (turns brighter)
2. Press `Delete` or `Backspace` key
3. Connection removed and hierarchy updated

---

## 📦 Technical Architecture

### New Files Created
```
components/
  ├── StakeholderNode.tsx      # Custom React Flow node component
  ├── CanvasToolbar.tsx        # Layout control buttons
  └── Canvas.tsx               # Updated with React Flow integration

hooks/
  └── useFlowState.ts          # State management for nodes/edges

utils/
  └── layout.ts                # Hierarchical positioning algorithms

types.ts                        # Extended with Connection interface
App.tsx                         # Updated with connection management
```

### Data Structure
```typescript
interface Connection {
  id: string;
  sourceId: string;      // Stakeholder ID
  targetId: string;      // Stakeholder ID
  account_id: string;
}

interface Stakeholder {
  // ... existing fields
  parentId?: string;
  childrenIds?: string[];
}
```

### Storage
All data persists in localStorage:
- `accounts` - Account list
- `stakeholders` - Stakeholder nodes with positions
- `connections` - All node-to-node relationships
- `activeAccountId` - Currently selected account

---

## ✅ Testing Checklist

- [x] Add node → drag → connect → line appears
- [x] Switch layout orientation → nodes reflow correctly
- [x] Refresh page → positions and connections persist
- [x] Delete edge → connection removed, state saved
- [x] All styles remain identical to prior build
- [x] Double-click node → edit modal opens
- [x] Export/Import → connections included
- [x] Mini-map navigation works
- [x] Zoom and pan smooth
- [x] Connection handles visible on hover

---

## 🔧 Installation & Running

```bash
# Install dependencies (includes React Flow)
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🎓 Tips & Best Practices

1. **Start with a root node** - Create a key stakeholder first, then connect others to build hierarchy
2. **Use layouts sparingly** - Manual positioning gives more control
3. **Color coding** - Use role badges to quickly identify stakeholder types
4. **Export regularly** - Save your work as JSON for backup
5. **Zoom out for overview** - Use mini-map to see entire relationship structure

---

## 🚀 What's Next?

Potential enhancements you could add:
- Connection labels (relationship types)
- Curved vs. straight line toggle
- Auto-layout on stakeholder creation
- Connection strength/weight indicators
- Group nodes by role or department
- Search/filter nodes
- Undo/redo functionality

---

**Enjoy mapping your stakeholder relationships!** 🎉
