import React, { useEffect, useState } from 'react';
import addBanner from '../firebase/addBanner';
import getAllDoc from '../firebase/getAllDoc';
import storeFile from '../firebase/storeFile';
import deleteData from '../firebase/deleteData';
import imageCompression from 'browser-image-compression';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default function Banner() {

    const [add, setAdd] = useState(true);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [album, setAlbum] = useState([]);
    const [albumData, setAlbumData] = useState([]);
    const [genre, setGenre] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [artist, setArtist] = useState("");
    const [selectedArtist, setSelectedArtist] = useState("");
    const [name, setName] = useState("");
    const [chosen, setChosen] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await getAllDoc("Banner");
        setData(res);
        const al = await getAllDoc("Album");
        setAlbumData(al);
    }

    const handleAdd = async () => {
        let albumName = "";
        let artistName = "";
        let genreName = "";
        let link;
        let linkName;

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
        if (image) {
            const options = {
                maxSizeMB: 0.2,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            let res;
            let type;
            try {
                setLoading(true);
                const compressedFile = await imageCompression(image, options);
                const fileLink = await storeFile(compressedFile);
                if (chosen) {
                    switch (chosen) {
                        case "album": {
                            albumName = albumData.filter(e => e.docId === album);
                            albumName = albumName[0].docData.title;
                            link = album;
                            linkName = albumName;
                            type = "album";
                            res = await addBanner(fileLink, name, link, linkName, type);
                            break;
                        };
                        case "genre": {
                            genreName = genre.filter(e => e.docId === selectedGenre);
                            genreName = genreName[0].docData.title;
                            link = selectedGenre;
                            linkName = genreName;
                            type = "genre";
                            res = await addBanner(fileLink, name, link, linkName, type);
                            break;
                        };
                        case "atist": {
                            artistName = artist.filter(e => e.docId === selectedArtist);
                            artistName = artistName[0].docData.title;
                            link = selectedArtist;
                            linkName = artistName;
                            type = "atist";
                            res = await addBanner(fileLink, name, link, linkName, type);
                            break;
                        };
                        default:
                            break;
                    }
                } else {
                    res = await addBanner(fileLink, name, link, linkName);
                }
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
            alert("Please add image first.");
            setLoading(false)

        }
    };

    const handleDelete = async (e) => {
        const res = await deleteData("Banner", e.docId);
        if (res === "true") {
            alert("Deleted!");
            window.location.reload(false);
        } else {
            alert("something went wrong!")
        }
    };

    const handleFetchGenre = async () => {
        const gen = await getAllDoc("Genre");
        setGenre(gen);
    };

    const handleFetchArtist = async () => {
        const art = await getAllDoc("Artist");
        setArtist(art);
    }

    return (
        <div>

            {!add ? <button onClick={() => setAdd(true)}
                className="btn waves-effect waves-light" type="submit" name="action">Add new Banner
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
                                onChange={e => setName(e.target.value)}
                                value={name} id="first_name2" type="text" className="validate" />
                            <label className="active" htmlFor="first_name2">Title</label>
                        </div>
                    </div>
                    <div className="file-field input-field" style={{ marginTop: 10 }}>
                        <div className="btn">
                            <span>Banner Image</span>
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
                    <p style={{ marginTop: 25 }}>You can select any one of them to link with the banner</p>
                    <Tabs style={{ marginTop: 5 }}>
                        <TabList>
                            <Tab>Album</Tab>
                            <Tab onClick={handleFetchGenre}>Genre</Tab>
                            <Tab onClick={handleFetchArtist}>Artist</Tab>
                            {/* <Tab>Songs</Tab> */}
                        </TabList>

                        <TabPanel>
                            <div className="row">
                                <p htmlFor="name">Album</p>
                                <select
                                    value={album}
                                    onChange={(e) => {
                                        setAlbum(e.target.value);
                                        setChosen("album")
                                    }}
                                    className="browser-default">
                                    <option value="" disabled >Choose</option>
                                    {!!albumData.length && albumData.map((e, i) => {
                                        return (
                                            <option value={e.docId} key={i}>{e.docData.title}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="row">
                                <p htmlFor="name">Genre</p>
                                <select
                                    value={selectedGenre}
                                    onChange={(e) => {
                                        setSelectedGenre(e.target.value)
                                        setChosen("genre")
                                    }}
                                    className="browser-default">
                                    <option value="" disabled >Choose</option>
                                    {!!genre.length && genre.map((e, i) => {
                                        return (
                                            <option value={e.docId} key={i}>{e.docData.title}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="row">
                                <p htmlFor="name">Artist</p>
                                <select
                                    value={selectedArtist}
                                    onChange={(e) => {
                                        setSelectedArtist(e.target.value);
                                        setChosen("atist")
                                    }}
                                    className="browser-default">
                                    <option value="" disabled >Choose</option>
                                    {!!artist.length && artist.map((e, i) => {
                                        return (
                                            <option value={e.docId} key={i}>{e.docData.title}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </TabPanel>
                    </Tabs>

                    {!loading && <button onClick={handleAdd} style={{ marginTop: 40 }}
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
                        <th></th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {!!data.length && data.map((e, i) => {
                        return (
                            <tr key={i}>
                                <td>Banner {i + 1}</td>
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