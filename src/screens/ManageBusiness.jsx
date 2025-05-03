import React from 'react';

const ManageBusiness = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Business Dashboard</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                    <h2>Overview</h2>
                    <p>Summary of business metrics will go here.</p>
                </div>
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                    <h2>Recent Activity</h2>
                    <p>Recent updates and logs will go here.</p>
                </div>
            </div>
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <h2>Detailed Reports</h2>
                <p>Graphs and detailed analytics will go here.</p>
            </div>
        </div>
    );
};

export default ManageBusiness;