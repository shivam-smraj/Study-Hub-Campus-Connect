import React, { useState } from 'react';
import { createFile, fetchBranches, fetchSubjectsByBranchId, fetchGlobalSubjects, fetchFilesBySubjectId, updateFile, deleteFile } from '../../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const FileUpload = () => {
    const [fileName, setFileName] = useState('');
    const [driveFileId, setDriveFileId] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [relativePath, setRelativePath] = useState('Root');
    const [description, setDescription] = useState('');
    const [fileType, setFileType] = useState('application/pdf');
    const [fileSize, setFileSize] = useState('');
    
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [isGlobalUpload, setIsGlobalUpload] = useState(false);
    
    const [editingId, setEditingId] = useState(null);

    const queryClient = useQueryClient();

    // Fetch branches
    const { data: branches } = useQuery({
        queryKey: ['branches'],
        queryFn: () => fetchBranches().then(res => res.data)
    });

    // Fetch subjects based on selection
    const { data: subjects } = useQuery({
        queryKey: ['subjects', selectedBranch, isGlobalUpload],
        queryFn: () => {
            if (isGlobalUpload) return fetchGlobalSubjects().then(res => res.data);
            if (selectedBranch) return fetchSubjectsByBranchId(selectedBranch).then(res => res.data);
            return [];
        },
        enabled: !!selectedBranch || isGlobalUpload
    });

    // Fetch files for the selected subject to allow editing/deleting
    const { data: files, isLoading: filesLoading } = useQuery({
        queryKey: ['files', selectedSubject],
        queryFn: () => fetchFilesBySubjectId(selectedSubject).then(res => res.data),
        enabled: !!selectedSubject
    });

    const createMutation = useMutation({
        mutationFn: createFile,
        onSuccess: () => {
            toast.success('File uploaded (metadata created) successfully!');
            resetForm();
            queryClient.invalidateQueries(['files']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateFile(id, data),
        onSuccess: () => {
            toast.success('File updated successfully!');
            resetForm();
            queryClient.invalidateQueries(['files']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFile,
        onSuccess: () => {
            toast.success('File deleted successfully!');
            queryClient.invalidateQueries(['files']);
        },
        onError: (err) => toast.error('Error: ' + (err.response?.data?.message || err.message))
    });

    const resetForm = () => {
        setFileName('');
        setDriveFileId('');
        setFileUrl('');
        setRelativePath('Root');
        setDescription('');
        setFileType('application/pdf');
        setFileSize('');
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            fileName,
            driveFileId,
            fileUrl,
            relativePath,
            description,
            fileType,
            fileSize,
            subject: selectedSubject
        };

        if (editingId) {
            updateMutation.mutate({ id: editingId, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (file) => {
        setFileName(file.fileName);
        setDriveFileId(file.driveFileId);
        setFileUrl(file.fileUrl);
        setRelativePath(file.relativePath);
        setDescription(file.description);
        setFileType(file.fileType);
        setFileSize(file.fileSize);
        setEditingId(file._id);
        toast('Editing file...', { icon: '✏️' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="admin-page">
            <h2>Manage Files</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                
                <div className="form-group">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={isGlobalUpload} 
                            onChange={(e) => {
                                setIsGlobalUpload(e.target.checked);
                                setSelectedBranch('');
                                setSelectedSubject('');
                            }} 
                        />
                        Upload to Global Subject?
                    </label>
                </div>

                {!isGlobalUpload && (
                    <div className="form-group">
                        <label>Select Branch</label>
                        <select 
                            value={selectedBranch} 
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            <option value="">-- Select Branch --</option>
                            {branches?.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Select Subject</label>
                    <select 
                        value={selectedSubject} 
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        required
                        disabled={!selectedBranch && !isGlobalUpload}
                    >
                        <option value="">-- Select Subject --</option>
                        {subjects?.map(s => (
                            <option key={s._id} value={s._id}>{s.name} ({s.courseCode})</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>File Name</label>
                    <input type="text" value={fileName} onChange={e => setFileName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Google Drive File ID</label>
                    <input type="text" value={driveFileId} onChange={e => setDriveFileId(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Google Drive View URL</label>
                    <input type="text" value={fileUrl} onChange={e => setFileUrl(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Relative Path (Folder Structure)</label>
                    <input 
                        type="text" 
                        value={relativePath} 
                        onChange={e => setRelativePath(e.target.value)} 
                        placeholder="e.g. Unit 1/Notes" 
                    />
                </div>
                <div className="form-group">
                    <label>File Type</label>
                    <select value={fileType} onChange={e => setFileType(e.target.value)}>
                        <option value="application/pdf">PDF</option>
                        <option value="application/vnd.google-apps.document">Google Doc</option>
                        <option value="application/vnd.google-apps.presentation">Google Slide</option>
                        <option value="image/jpeg">Image (JPEG)</option>
                        <option value="image/png">Image (PNG)</option>
                        <option value="video/mp4">Video (MP4)</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>File Size (e.g. 2.5 MB)</label>
                    <input type="text" value={fileSize} onChange={e => setFileSize(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingId ? 'Update File' : 'Save File Metadata'}
                    </button>
                    {editingId && <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>}
                </div>
            </form>

            {selectedSubject && (
                <div className="list-section">
                    <h3>Files in Selected Subject</h3>
                    {filesLoading ? <p>Loading files...</p> : (
                        <ul className="admin-list">
                            {files?.map(file => (
                                <li key={file._id} className="list-item">
                                    <span>{file.fileName} ({file.relativePath})</span>
                                    <div className="item-actions">
                                        <button onClick={() => handleEdit(file)} className="btn-edit">Edit</button>
                                        <button onClick={() => handleDelete(file._id)} className="btn-delete">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
