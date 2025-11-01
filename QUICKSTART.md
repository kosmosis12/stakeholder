# 🚀 Quick Start Guide

## Installation

```bash
cd c:\Users\User1\Documents\stakeholder
npm install
npm run dev
```

The app will open at `http://localhost:5173`

---

## First Steps

### 1. Create an Account
- Type account name in the input field at the top of left panel
- Click the `+` button
- Your first account is now active!

### 2. Add Stakeholders
- Click **"Add Stakeholder"** button (green)
- Fill in the form:
  - **Name**: Person's name
  - **Title**: Their job title
  - **Role**: Select from dropdown (Champion, Influencer, etc.)
  - **Responsibilities**: What they do (optional)
  - **Notes**: Any additional info (optional)
- Click **Save**
- Node appears on canvas!

### 3. Connect Stakeholders
- Hover over a stakeholder node
- You'll see 4 small circles (connection handles)
- **Click and drag** from one handle to another node
- Release to create the connection
- A smooth mint-colored line appears!

### 4. Organize with Auto-Layout
- After creating connections, click **"Horizontal Layout"** or **"Vertical Layout"**
- Nodes automatically arrange based on parent-child relationships
- You can still drag nodes manually to fine-tune

### 5. Navigate the Canvas
- **Zoom In/Out**: Mouse wheel or trackpad pinch
- **Zoom Buttons**: Use +/– buttons in top-right corner
- **Pan**: Click and drag empty canvas space
- **Reset View**: Click ⟳ button to return to 100% zoom
- **Zoom Range**: 50% to 200%

### 6. Edit & Delete
- **Edit Stakeholder**: Double-click any node
- **Delete Stakeholder**: Double-click node → Delete button in modal
- **Delete Connection**: Click edge → press Delete/Backspace key

### 7. Save & Export
- Everything auto-saves to localStorage
- Export: Click **Export** button → saves JSON file
- Import: Click **Import** button → load JSON file

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Delete connection | `Delete` or `Backspace` |
| Pan canvas | Hold `Space` + drag |
| Fit view | `Shift` + `1` |

---

## Tips

💡 **Build from top down**: Create executive sponsors first, then connect their influencers  
💡 **Use role colors**: Color-coded badges help identify stakeholder types quickly  
💡 **Export often**: Save your work as JSON backups  
💡 **Zoom out**: Use mini-map to see the big picture  
💡 **Manual override**: Drag nodes after auto-layout for perfect positioning  

---

## Troubleshooting

**Nodes won't connect?**  
→ Make sure you're dragging from one handle to another (not just empty space)

**Layout button does nothing?**  
→ You need at least one connection for hierarchy to exist

**Lost nodes off-screen?**  
→ Click the **Reset** button or use the mini-map to navigate

**Data not persisting?**  
→ Check browser localStorage is enabled (private/incognito mode may block it)

---

**Ready to map your stakeholders!** 🎉
