import React, { useEffect, useState } from 'react';
import getAllDoc from '../firebase/getAllDoc';
import storeFile from '../firebase/storeFile';
import deleteData from '../firebase/deleteData';
import imageCompression from 'browser-image-compression';
import addSongs from '../firebase/addSong';

export default function Song() {

    const [add, setAdd] = useState(true);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [album, setAlbum] = useState('');
    const [audio, setAudio] = useState("");
    const [artist, setArtist] = useState("");
    const [selectedArtist, setSelectedArtist] = useState("");
    const [genre, setGenre] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [albumData, setAlbumData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await getAllDoc("Songs");
        setData(res);
        const al = await getAllDoc("Album");
        setAlbumData(al);
        const art = await getAllDoc("Artist");
        setArtist(art);
        const gen = await getAllDoc("Genre");
        setGenre(gen);
    }

    const handleAdd = async () => {
        let albumName = albumData.filter(e => e.docId === album);
        let artistName = artist.filter(e => e.docId === selectedArtist);
        let genreName = genre.filter(e => e.docId === selectedGenre);
        // console.log(genreName[0]);
        if (name && image && audio) {
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
                const audioLink = await storeFile(audio);
                // let fileLink = ""
                // let audioLink = ""
                if (!genreName.length) {
                    genreName = "";
                } else if (genreName.length) {
                    genreName = genreName[0].docData.title;
                }
                if (!albumName.length) {
                    albumName = "";
                } else if (albumName.length) {
                    albumName = albumName[0].docData.title;
                }
                if (!artistName.length) {
                    artistName = "";
                    console.log("albumName")
                } else if (artistName.length) {
                    artistName = artistName[0].docData.title;
                    console.log("no---albumName")
                }
                const res = await addSongs(name, fileLink, album, audioLink, albumName, artistName, selectedArtist, genreName, selectedGenre);
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
        const res = await deleteData("Songs", e.docId);
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
                className="btn waves-effect waves-light" type="submit" name="action">Add new Song
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
                                <span>Audio</span>
                                <input type="file"
                                    onChange={e => setAudio(e.target.files[0])}
                                    accept=".mp3,audio/*"
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input
                                    className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <p htmlFor="name">Album</p>
                        <select
                            value={album}
                            onChange={(e) => { setAlbum(e.target.value) }}
                            className="browser-default">
                            <option value="" disabled >Choose</option>
                            {!!albumData.length && albumData.map((e, i) => {
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
                    </div>
                    <div className="row">
                        <p htmlFor="name">Genre</p>
                        <select
                            value={selectedGenre}
                            onChange={(e) => { setSelectedGenre(e.target.value) }}
                            className="browser-default">
                            <option value="" disabled >Choose</option>
                            {!!genre.length && genre.map((e, i) => {
                                return (
                                    <option value={e.docId} key={i}>{e.docData.title}</option>
                                )
                            })}
                        </select>
                    </div>
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