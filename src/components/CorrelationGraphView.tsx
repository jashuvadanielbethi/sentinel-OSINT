import React, { useState } from 'react';
import { CorrelationGraphData, CorrelationNode } from '../types/osint.js';
import { Shield, ExternalLink, Hash, Info, User, Globe, Code, MessageSquare, Database } from 'lucide-react';

interface CorrelationGraphViewProps {
  graph?: CorrelationGraphData;
  targetUsername?: string;
}

export const CorrelationGraphView: React.FC<CorrelationGraphViewProps> = ({ graph, targetUsername }) => {
  const [selectedNode, setSelectedNode] = useState<CorrelationNode | null>(null);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-xs">
        <p className="text-sm">No correlation graph data generated yet. Run a username investigation to build the relationship topology.</p>
      </div>
    );
  }

  // Position nodes in a radial layout around the central target
  const width = 640;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;

  const targetNode = graph.nodes.find((n) => n.type === 'target') || graph.nodes[0];
  const otherNodes = graph.nodes.filter((n) => n.id !== targetNode.id);

  const nodePositions: Record<string, { x: number; y: number }> = {
    [targetNode.id]: { x: centerX, y: centerY },
  };

  const radius = Math.min(centerX, centerY) - 70;
  otherNodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / Math.max(1, otherNodes.length) - Math.PI / 2;
    nodePositions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-blue-600" />
            Evidence Correlation Graph
          </h3>
          <p className="text-xs text-slate-500">
            Interactive multi-node relationship topology. Click any node to inspect evidentiary backing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-700 border border-blue-200">
            {graph.nodes.length} Nodes
          </span>
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 border border-slate-200">
            {graph.links.length} Relationships
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
        {/* SVG Graph Canvas */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50/70 shadow-inner">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
            <defs>
              <linearGradient id="linkGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Links */}
            {graph.links.map((link, idx) => {
              const srcPos = nodePositions[link.source];
              const tgtPos = nodePositions[link.target];
              if (!srcPos || !tgtPos) return null;

              const midX = (srcPos.x + tgtPos.x) / 2;
              const midY = (srcPos.y + tgtPos.y) / 2;

              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke="url(#linkGradLight)"
                    strokeWidth={Math.max(1.5, link.strength * 2.5)}
                    strokeDasharray={link.relationship === 'Handle Reuse' ? '4 3' : undefined}
                  />
                  {/* Relationship badge */}
                  <text
                    x={midX}
                    y={midY - 4}
                    fill="#475569"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="600"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {link.relationship}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {graph.nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const isTarget = node.type === 'target';
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedNode(node)}
                >
                  <circle
                    r={isTarget ? 24 : 18}
                    fill={isTarget ? '#1d4ed8' : isSelected ? '#eff6ff' : '#ffffff'}
                    stroke={isSelected ? '#2563eb' : isTarget ? '#1e40af' : '#64748b'}
                    strokeWidth={isSelected ? 3 : isTarget ? 2.5 : 1.8}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={isTarget ? '#ffffff' : '#0f172a'}
                    fontSize={isTarget ? '10' : '8.5'}
                    fontWeight={isTarget ? '700' : '600'}
                    className="select-none pointer-events-none font-mono"
                  >
                    {node.label.length > 12 ? node.label.slice(0, 10) + '…' : node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Graph Legend */}
          <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-3 bg-white/95 px-2.5 py-1 rounded border border-slate-200 text-[10px] text-slate-600 shadow-xs">
            <div className="flex items-center gap-1 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Target Query
            </div>
            <div className="flex items-center gap-1 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-white border border-slate-500" /> Platform Handle
            </div>
            <div className="flex items-center gap-1 font-medium">
              <span className="w-3 border-b border-dashed border-blue-600" /> Handle Reuse
            </div>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-blue-600" />
                Node Inspector
              </span>
              {selectedNode ? (
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-blue-700 border border-blue-200">
                  {selectedNode.type.toUpperCase()}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Select a node</span>
              )}
            </div>

            {selectedNode ? (
              <div className="mt-3 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Label</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedNode.label}</div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Source</span>
                  <div className="text-slate-700 font-mono text-[11px] font-medium">{selectedNode.source}</div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Confidence</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${selectedNode.confidence}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-blue-700 font-bold">
                      {selectedNode.confidence}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Evidence Basis</span>
                  <p className="mt-0.5 text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                    {selectedNode.evidence || 'Baseline query node for cross-correlation.'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Timestamp</span>
                  <div className="text-[10px] text-slate-500 font-mono">{selectedNode.timestamp}</div>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-xs text-slate-400 py-6">
                Click any node in the correlation graph to view its source validation, confidence weighting, and linked evidence items.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 italic">
            Disclaimer: Correlation demonstrates handle repetition across namespaces; it does not constitute evidentiary proof of singular identity.
          </div>
        </div>
      </div>
    </div>
  );
};
