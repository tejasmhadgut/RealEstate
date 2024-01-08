import React from 'react'
import {useSelector} from 'react-redux';
import {useRef, useState, useEffect} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
    const fileRef = useRef(null)
    const {currentUser, loading, error} = useSelector((state)=> state.user)
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData,setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();

    console.log("File one "+file);
    useEffect(() => {
        if(file){
            handleFileUpload(file);
        }
    }, [file]);
    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setFilePerc(Math.round(progress));
            },
            (error) => {
              setFileUploadError(true);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("download url "+downloadURL)
                setFormData({ ...formData, avator: downloadURL })
                
              }
              );
            }
          );
        };

    const handleChange = (e) => {
        console.log("target one ")
        console.log(e.target.value)
        setFormData({...formData, [e.target.id]: e.target.value });
       // console.log("after target "+formData)
    };

    const handleSubmit = async (e) => {
        console.log("on submit ")
        console.log(formData)
        
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log(await res.json())
            const data = await res.json();
            
            if(data.success === false){
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
                dispatch(updateUserFailure(error.message));
        }
    }

  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form onSubmit={handleSubmit}
    className='flex flex-col gap-4'>
    <input onChange={(e)=> setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='images/*' />
        <img onClick={()=> fileRef.current.click()} src={formData.avator || currentUser.avator} alt='profile' 
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type='text' placeholder='username' defaultValue={currentUser.username}  onChange={handleChange}
        className='border p-3 rounded-lg' id='username' />
        <input type='text' placeholder='email' id='email' defaultValue={currentUser.email} onChange={handleChange}
        className='border p-3 rounded-lg' />
        <input type='password' placeholder='password' id='password' onChange={handleChange}
        className='border p-3 rounded-lg' />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
    </form>
    <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
    </div>

    <p className='text-red-700 mt-5'>{error ? error : ''}</p>
    <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  )
}
