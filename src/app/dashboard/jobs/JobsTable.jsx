'use client'
import { FaCircleInfo, FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import Model from "@/components/Model";
import { useState } from "react";
import AddandEditForm from "./AddandEditForm";


const JobsTable = () => {
    const [modalId, setModalId] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [editJobData, setEditJobData] = useState(null);

    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data: jobs = [], } = useSWR('http://localhost:5000/jobs', fetcher);
    console.log(jobs);
    const handleStatus = (_id, status) => {
        console.log(_id, status);
        fetch(`http://localhost:5000/jobs?_id=${_id}&status=${status}`, {
            method: 'PUT'
        })
            .then(res => res.json())
            .then(data => {
                if (data.statusCode == 200) {
                    toast.success(`The Job post have been ${data.result.status == 'active' ? 'activated' : 'deactivated'}`)
                    mutate('http://localhost:5000/jobs')
                }
            })
    }
    //Job deleted by ID 
    const handleDelete = (_id) => {
        fetch(`http://localhost:5000/jobs/${_id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                if (data.statusCode == 200) {
                    toast.error(data.message)
                    mutate('http://localhost:5000/jobs')
                }
            })
    }
    //Get Job data by ID
    const handleEdit = (_id,job) => {
        setModalId(_id)
        setModalTitle('Edit Job post')
        setEditJobData(job)  
    }
    
    return (
        <>
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Job Title</th>
                            <th>Publised On</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            jobs?.map((job, index) => <tr key={job._id}>
                                <th>{index + 1}</th>
                                <td>{job.title}</td>
                                <td>{job.publishedOn}</td>
                                <td>{job.deadline}</td>
                                <td><button className="btn btn-xs btn-primary" onClick={() => handleStatus(job._id, job.status == 'deactive' ? 'active' : 'deactive')}>{job.status}</button></td>
                                <td>
                                    <div className="join">
                                    <label htmlFor={job._id} onClick={()=>handleEdit(job._id,job)} className="btn btn-xs btn-primary join-item"><FaPenToSquare /></label>
                                        <button className="btn btn-xs join-item"><FaCircleInfo /></button>
                                        <button onClick={() => handleDelete(job._id)} className="btn btn-xs btn-warning join-item" ><FaTrashCan /></button>
                                    </div></td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <Model   modalId={modalId} modelTitle={modalTitle}>
                <AddandEditForm editJobData={editJobData}/>
            </Model>
        </>
    );
};

export default JobsTable;