import React, { useEffect, useState } from 'react';
import getAllDoc from '../firebase/getAllDoc';
import storeFile from '../firebase/storeFile';
import deleteData from '../firebase/deleteData';
import imageCompression from 'browser-image-compression';
import addVideo from '../firebase/addVideo';

export default function Video() {

    const [add, setAdd] = useState(false);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [album, setAlbum] = useState('');
    const [video, setVideo] = useState("");
    const [artist, setArtist] = useState("");
    const [selectedArtist, setSelectedArtist] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await getAllDoc("Videos");
        setData(res);
        // const art = await getAllDoc("Artist");
        // setArtist(art);
    }

    const handleAdd = async () => {
        // let albumName = data.filter(e => e.docId === album);
        // let artistName = artist.filter(e => e.docId === selectedArtist);
        // console.log(albumName[0])
        if (name && image && video) {
            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            try {
                setLoading(true);

                const compressedFile = await imageCompression(image, options);
                // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                const fileLink = await storeFile(compressedFile);
                const videoLink = await storeFile(video);
                // let fileLink = ""
                // let audioLink = ""
                const res = await addVideo(name, fileLink, videoLink);
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
            alert("Please add video, image and title.");
            setLoading(false)

        }
    };

    const handleDelete = async (e) => {
        const res = await deleteData("Videos", e.docId);
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
                className="btn waves-effect waves-light" type="submit" name="action">Add new Video
                 <i className="material-icons right">add</i>
            </button>
                :
                <div>
                    <button onClick={() => setAdd(false)}
                        style={{ marginBottom: 50 }}
                        className="btn-floating btn-large waves-effect waves-light red">
                        <i className="material-icons">arrow_back</i>
                    </button>
                    <div className="row">
                        <p>Add video</p>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setName(e.target.value)}
                                value={name} id="first_name2" type="text" className="validate" />
                            <label className="active" htmlFor="first_name2">Title</label>
                        </div>
                    </div>
                    <div className="row">
                        <p htmlFor="name">Audio file</p>
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>Video</span>
                                <input type="file"
                                    onChange={e => setVideo(e.target.files[0])}
                                    accept="video/mp4,video/x-m4v,video/*"
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input
                                    className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="row">
                        <p htmlFor="name">Album</p>
                        <select
                            value={album}
                            onChange={(e) => { setAlbum(e.target.value) }}
                            className="browser-default">
                            <option value="" disabled >Choose</option>
                            {!!data.length && data.map((e, i) => {
                                return (
                                    <option value={e.docId} key={i}>{e.docData.title}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="row">
                        <p htmlFor="name">Artist</p>
                        <select
                            value={selectedArtist}
                            onChange={(e) => { setSelectedArtist(e.target.value) }}
                            className="browser-default">
                            <option value="" disabled >Choose</option>
                            {!!artist.length && artist.map((e, i) => {
                                return (
                                    <option value={e.docId} key={i}>{e.docData.title}</option>
                                )
                            })}
                        </select>
                    </div> */}
                    <div className="file-field input-field" >
                        <div className="btn">
                            <span>Cover Image</span>
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
                        <th>Title</th>
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