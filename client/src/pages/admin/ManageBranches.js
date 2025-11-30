import React, { useState } from 'react';
import { createBranch, fetchBranches, updateBranch, deleteBranch } from '../../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ManageBranches = () => {
    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [editingId, setEditingId] = useState(null); // Track which branch is being edited
    const queryClient = useQueryClient();

    const { data: branches, isLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: () => fetchBranches().then(res => res.data)
    });

    const createMutation = useMutation({
        mutationFn: createBranch,
        onSuccess: () => {
            toast.success('Branch created successfully!');
            resetForm();
            queryClient.invalidateQueries(['branches']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateBranch(id, data),
        onSuccess: () => {
            toast.success('Branch updated successfully!');
            resetForm();
            queryClient.invalidateQueries(['branches']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBranch,
        onSuccess: () => {
            toast.success('Branch deleted successfully!');
            queryClient.invalidateQueries(['branches']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const resetForm = () => {
        setName('');
        setShortName('');
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: { name, shortName } });
        } else {
            createMutation.mutate({ name, shortName });
        }
    };

    const handleEdit = (branch) => {
        setName(branch.name);
        setShortName(branch.shortName);
        setEditingId(branch._id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="admin-page">
            <h2>Manage Branches</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Branch Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        placeholder="e.g. Computer Science"
                    />
                </div>
                <div className="form-group">
                    <label>Short Name (Code)</label>
                    <input 
                        type="text" 
                        value={shortName} 
                        onChange={(e) => setShortName(e.target.value)} 
                        required 
                        placeholder="e.g. CSE"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingId ? 'Update Branch' : 'Create Branch'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn-cancel">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <div className="list-section">
                <h3>Existing Branches</h3>
                {isLoading ? <p>Loading...</p> : (
                    <ul className="admin-list">
                        {branches?.map(branch => (
                            <li key={branch._id} className="list-item">
                                <span>{branch.name} ({branch.shortName})</span>
                                <div className="item-actions">
                                    <button onClick={() => handleEdit(branch)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(branch._id)} className="btn-delete">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ManageBranches;
