import { useState } from 'react';
import ReactFlow, {
    Node,
    addEdge,
    Background,
    Edge,
    Connection,
    useNodesState,
    useEdgesState,
    getConnectedEdges,
    Controls
  } from "reactflow";
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 0, y: 0 },
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges : Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', style: { stroke: "red" } },
];

export function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const [selectedNode, setSelectedNode] = useState<Node>();

    const onNodeSelect = (node: Node) => {



        const newEdges = edges.map(edge => {
            
            if (edge.source == node.id) return { ...edge, animated: true, style: { stroke: "red" } };

            return { ...edge, animated: false, style: {}};
        });

        setEdges(newEdges);
        setSelectedNode(node);
    }

    const onNodeClick = (event: React.MouseEvent, node: Node)  => {
        onNodeSelect(node);
        // console.log(edge);
    }

    const onNodeDragStart = (event: React.MouseEvent, node: Node)  => {
        onNodeSelect(node);
    }

    const onNodeDragEnd = (event: React.MouseEvent, node: Node)  => {
        onNodeSelect(node);
    }

    const onNodeDrag = (event: React.MouseEvent, node: Node)  => {
        onNodeSelect(node);
    }
    
    const onNode = (event: React.MouseEvent, node: Node)  => {
    }

    return <ReactFlow
    nodesFocusable={false} 
    elementsSelectable={false}
    onNodeClick={onNodeClick} 
    onNodeDragStart={onNodeDragStart}
    onNodeDragStop={onNodeDragEnd}
    onNodeDrag={onNodeDrag}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    nodes={nodes} 
    edges={edges} 
    snapToGrid={true}
    fitView>
        <Controls />
        <Background color="#aaa" gap={16} />
    </ReactFlow>;
}

export default Flow;