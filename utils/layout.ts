
import type { Stakeholder } from '../types';

export type LayoutDirection = 'horizontal' | 'vertical';

const NODE_WIDTH = 224;
const NODE_HEIGHT = 160;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 80;

interface TreeNode {
  stakeholder: Stakeholder;
  children: TreeNode[];
  depth: number;
}

function buildTree(stakeholders: Stakeholder[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  stakeholders.forEach(s => {
    nodeMap.set(s.id, { stakeholder: s, children: [], depth: 0 });
  });

  stakeholders.forEach(s => {
    const node = nodeMap.get(s.id)!;
    if (s.parentId && nodeMap.has(s.parentId)) {
      const parent = nodeMap.get(s.parentId)!;
      parent.children.push(node);
      node.depth = parent.depth + 1;
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function calculateHorizontalLayout(roots: TreeNode[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  let currentY = 50;

  function layoutTree(node: TreeNode, x: number) {
    const y = currentY;
    positions.set(node.stakeholder.id, { x, y });

    if (node.children.length > 0) {
      currentY += NODE_HEIGHT + VERTICAL_SPACING;
      node.children.forEach(child => {
        layoutTree(child, x + NODE_WIDTH + HORIZONTAL_SPACING);
      });
    } else {
      currentY += NODE_HEIGHT + VERTICAL_SPACING;
    }
  }

  roots.forEach(root => {
    layoutTree(root, 50);
  });

  return positions;
}

function calculateVerticalLayout(roots: TreeNode[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  let currentX = 50;

  function layoutTree(node: TreeNode, y: number) {
    const x = currentX;
    positions.set(node.stakeholder.id, { x, y });

    if (node.children.length > 0) {
      currentX += NODE_WIDTH + HORIZONTAL_SPACING;
      node.children.forEach(child => {
        layoutTree(child, y + NODE_HEIGHT + VERTICAL_SPACING);
      });
    } else {
      currentX += NODE_WIDTH + HORIZONTAL_SPACING;
    }
  }

  roots.forEach(root => {
    layoutTree(root, 50);
  });

  return positions;
}

export function applyHierarchicalLayout(
  stakeholders: Stakeholder[],
  direction: LayoutDirection
): Stakeholder[] {
  const roots = buildTree(stakeholders);
  const positions = direction === 'horizontal' 
    ? calculateHorizontalLayout(roots)
    : calculateVerticalLayout(roots);

  return stakeholders.map(s => {
    const pos = positions.get(s.id);
    if (pos) {
      return { ...s, x_pos: pos.x, y_pos: pos.y };
    }
    return s;
  });
}
