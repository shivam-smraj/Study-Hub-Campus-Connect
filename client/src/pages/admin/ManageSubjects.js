import React, { useState } from 'react';
import { createSubject, fetchBranches, fetchSubjectsByBranchId, fetchGlobalSubjects, updateSubject, deleteSubject } from '../../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ManageSubjects = () => {
    const [name, setName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [isGlobal, setIsGlobal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // For listing subjects, we need to select a branch to view its subjects, or view global
    const [viewBranchId, setViewBranchId] = useState('');
    const [viewGlobal, setViewGlobal] = useState(false);

    const queryClient = useQueryClient();

    // Fetch branches for the selection list
    const { data: branches } = useQuery({
        queryKey: ['branches'],
        queryFn: () => fetchBranches().then(res => res.data)
    });

    // Fetch subjects for the list view
    const { data: subjectsList, isLoading: subjectsLoading } = useQuery({
        queryKey: ['subjects', viewBranchId, viewGlobal],
        queryFn: () => {
            if (viewGlobal) return fetchGlobalSubjects().then(res => res.data);
            if (viewBranchId) return fetchSubjectsByBranchId(viewBranchId).then(res => res.data);
            return [];
        },
        enabled: !!viewBranchId || viewGlobal
    });

    const createMutation = useMutation({
        mutationFn: createSubject,
        onSuccess: () => {
            toast.success('Subject created successfully!');
            resetForm();
            queryClient.invalidateQueries(['subjects']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateSubject(id, data),
        onSuccess: () => {
            toast.success('Subject updated successfully!');
            resetForm();
            queryClient.invalidateQueries(['subjects']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSubject,
        onSuccess: () => {
            toast.success('Subject deleted successfully!');
            queryClient.invalidateQueries(['subjects']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const resetForm = () => {
        setName('');
        setCourseCode('');
        setSelectedBranches([]);
        setIsGlobal(false);
        setEditingId(null);
    };

    const handleBranchChange = (e) => {
        const branchId = e.target.value;
        if (e.target.checked) {
            setSelectedBranches([...selectedBranches, branchId]);
        } else {
            setSelectedBranches(selectedBranches.filter(id => id !== branchId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { name, courseCode, branches: selectedBranches, isGlobal };
        if (editingId) {
            updateMutation.mutate({ id: editingId, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (subject) => {
        setName(subject.name);
        setCourseCode(subject.courseCode);
        setIsGlobal(subject.isGlobal);
        setSelectedBranches(subject.branches || []); 
        setEditingId(subject._id);
        toast('Editing subject. Note: Branch selection might need to be re-selected.', { icon: 'ℹ️' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="admin-page">
            <h2>Manage Subjects</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Subject Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Course Code</label>
                    <input 
                        type="text" 
                        value={courseCode} 
                        onChange={(e) => setCourseCode(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={isGlobal} 
                            onChange={(e) => setIsGlobal(e.target.checked)} 
                        />
                        Is Global Subject? (e.g. Syllabus, Question Papers)
                    </label>
                </div>

                {!isGlobal && (
                    <div className="form-group">
                        <label>Select Branches:</label>
                        <div className="checkbox-group">
                            {branches?.map(branch => (
                                <label key={branch._id} style={{display: 'block'}}>
                                    <input 
                                        type="checkbox" 
                                        value={branch._id}
                                        checked={selectedBranches.includes(branch._id)}
                                        onChange={handleBranchChange}
                                    />
                                    {branch.name}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingId ? 'Update Subject' : 'Create Subject'}
                    </button>
                    {editingId && <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>}
                </div>
            </form>

            <div className="list-section">
                <h3>Existing Subjects</h3>
                <div className="filters">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={viewGlobal} 
                            onChange={(e) => {
                                setViewGlobal(e.target.checked);
                                if(e.target.checked) setViewBranchId('');
                            }} 
                        />
                        View Global Subjects
                    </label>
                    {!viewGlobal && (
                        <select value={viewBranchId} onChange={(e) => setViewBranchId(e.target.value)}>
                            <option value="">-- Select Branch to View --</option>
                            {branches?.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {subjectsLoading ? <p>Loading...</p> : (
                    <ul className="admin-list">
                        {subjectsList?.map(subject => (
                            <li key={subject._id} className="list-item">
                                <span>{subject.name} ({subject.courseCode})</span>
                                <div className="item-actions">
                                    <button onClick={() => handleEdit(subject)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(subject._id)} className="btn-delete">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ManageSubjects;
