import React, { useState, useEffect } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import axios from 'axios';

// Define a prefix for the API URL
var prefix = "http://localhost:8000"

// Fetch network data from the API
const fetchNetworkData = async () => {
    const response = await axios.get(prefix + '/api/network_data/');
    return response.data;
};

// Define the NetworkGraph component
const NetworkGraph = () => {
    // Initialize state for nodes, edges, and network
    const [nodes, setNodes] = useState(new DataSet([]));
    const [edges, setEdges] = useState(new DataSet([]));
    const [network, setNetwork] = useState(null);

    // Fetch network data and update the state
    useEffect(() => {
        const fetchData = async () => {
        const networkData = await fetchNetworkData();
        const newNodes = new DataSet(networkData.nodes);
        const newEdges = new DataSet(networkData.edges);

        // Update the state with the new data
        setNodes(newNodes);
        setEdges(newEdges);
        };

        // Fetch data immediately after the component is mounted
        fetchData();

        // Fetch data every 2 second
        const intervalId = setInterval(fetchData, 2000);

        // Cleanup the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []);


    // Create the network graph
    useEffect(() => {
        // Create a new network graph only if it doesn't exist
        if (network === null) {
            const container = document.getElementById('network-graph');
            const data = {
                nodes: nodes,
                edges: edges,
            };           
            // Customize the graph's appearance with options
            const options = {
                layout: {
                    improvedLayout: false,
                    hierarchical: {
                        enabled: false,
                    },
                },
                nodes: {
                    borderWidth: 1,
                    borderWidthSelected: 2,
                    chosen: true,
                    color: {
                        border: '#2B7CE9',
                        background: '#97C2FC',
                        highlight: {
                            border: '#2B7CE9',
                            background: '#D2E5FF'
                        },
                        hover: {
                            border: '#2B7CE9',
                            background: '#D2E5FF'
                        }
                    },
                    opacity: 1,
                    fixed: {
                        x: true,
                        y: true
                    },
                    font: {
                        color: '#343434',
                        size: 14, // px
                        face: 'arial',
                        background: 'none',
                        strokeWidth: 0, // px
                        strokeColor: '#ffffff',
                        align: 'center',
                        multi: false,
                        vadjust: 0,
                    },
                    group: undefined,
                    heightConstraint: false,
                    hidden: false,
                    level: undefined,
                    physics: false,
                    scaling: {
                        min: 30,
                        max: 30,
                        label: {
                            enabled: true,
                            min: 10,
                            max: 30,
                            maxVisible: 30,
                            drawThreshold: 5
                        },
                        customScalingFunction: function (min, max, total, value) {
                            if (max === min) {
                                return 0.5;
                            }
                            else {
                                let scale = 1 / (max - min);
                                return Math.max(0, (value - min) * scale);
                            }
                        }
                    },
                    shadow: {
                        enabled: false,
                        color: 'rgba(0,0,0,0.5)',
                        size: 10,
                        x: 5,
                        y: 5
                    },
                    shape: 'circle',
                    shapeProperties: {
                        borderDashes: false,
                    },
                    size: 500,
                    title: undefined,
                    value: undefined,
                    widthConstraint: false,
                },
                edges: {
                    arrows: {
                        to: {
                            enabled: false,
                        },
                        from: {
                            enabled: false,
                        }
                    }
                },
                physics: {
                    enabled: true,
                    solver: 'repulsion',
                    repulsion: {
                        centralGravity: 0,
                        springLength: 200,
                        springConstant: 0.01,
                        nodeDistance: 100,
                        damping: 0.08,
                    },
                },
            };
            // Create a new network graph with the specified container, data, and options
            const newNetwork = new Network(container, data, options);
            setNetwork(newNetwork);
        } else {
            // Update the network instance with the new nodes and edges
            network.setData({ nodes: nodes, edges: edges });
          }
        }, [nodes, edges, network]);

    // Render the network graph container
    return <div id="network-graph" style={{ width: '100%', height: '100%' }} />;
};

export default NetworkGraph;
