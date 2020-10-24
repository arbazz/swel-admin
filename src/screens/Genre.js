import React, { useEffect, useState } from 'react';
import getAllDoc from '../firebase/getAllDoc';
import storeFile from '../firebase/storeFile';
import deleteData from '../firebase/deleteData';
import imageCompression from 'browser-image-compression';
import addArtist from '../firebase/addArtist';
import addGenre from '../firebase/addGenre';

export default function Genre() {

    const [add, setAdd] = useState(true);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await getAllDoc("Artist");
        setData(res);
       
    }

    const handleAdd = async () => {
        if (name && image) {
            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            try {
                setLoading(true);

                const compressedFile = await imageCompression(image, options);
                console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                const fileLink = await storeFile(compressedFile);
                const res = await addGenre(name, fileLink);
                if (res === true) {
                    alert("sucess");
                    setLoading(false)
                } else {
                    alert("Error");
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
            }

        } else {
            alert("Please add image and title.");
            setLoading(false)

        }
    };

    const handleDelete = async (e) => {
        const res = await deleteData("Artist", e.docId);
        if (res === "true") {
            alert("Deleted!");
            window.location.reload(false);
        } else {
            alert("something went wrong!")
        }
    }

    return (
        <div>

            {!add ? <button onClick={() => setAdd(true)}
                className="btn waves-effect waves-light" type="submit" name="action">Add new Genre
                 <i className="material-icons right">add</i>
            </button>
                :
                <div>
                    <button onClick={() => setAdd(false)}
                        className="btn-floating btn-large waves-effect waves-light red">
                        <i className="material-icons">arrow_back</i>
                    </button>
                    <div className="row" style={{ marginTop: 50 }}>
                        <div className="input-field col s12">
                            <input
                                placeholder="Artist name"
                                onChange={e => setName(e.target.value)}
                                value={name} id="first_name2" type="text" className="validate" />
                            <label className="active" htmlFor="first_name2">Name</label>
                        </div>
                    </div>
                    <div className="file-field input-field" >
                        <div className="btn">
                            <span>Image</span>
                            <input type="file"
                                accept="image/x-png,image/gif,image/jpeg"
                                onChange={e => setImage(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input
                                className="file-path validate" type="text" />
                        </div>
                    </div>
                    {!loading && <button onClick={handleAdd}
                        className="btn waves-effect waves-light"
                        type="submit" name="action">Submit
                    <i className="material-icons right">add</i>
                    </button>}
                    {loading && <div className="progress">
                        <div className="indeterminate"></div>
                    </div>}
                </div>
            }

            {!add && <table className="striped" style={{ marginTop: 30 }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {!!data.length && data.map((e, i) => {
                        return (
                            <tr key={i}>
                                <td>{e.docData.title}</td>
                                <td><img alt="banner" style={{ width: 100, height: 50 }} src={e.docData.image} /></td>
                                <td style={{ color: 'red' }} onClick={() => handleDelete(e)}>Delete</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>}

        </div>
    )
}