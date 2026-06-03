"use client";
import React from 'react';
import { renderNode, DocNode } from '../../utils/NodeMapper';

interface TourContentProps {
  nodes: DocNode[];
}

const TourContent: React.FC<TourContentProps> = ({ nodes }) => {
  if (!nodes || !Array.isArray(nodes)) return null;
  return <>{nodes.map((node, idx) => renderNode(node as DocNode, idx, true))}</>;
};

export default TourContent;
