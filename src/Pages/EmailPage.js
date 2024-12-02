import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import parse from 'html-react-parser';
import "../style.css"

const EmailPage = () => {
    const [email, setEmail] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [itemOffset, setItemoffset] = useState(0);
    const [singledata, setSingledat] = useState([])
    const [clicked, setClicked] = useState(false)
    const [singledataname, setSingledataname] = useState('')
    const [date, setDate] = useState('')
    const [subject, setSubject] = useState('')
    const [clickedEmailId, setClickedEmailId] = useState(null);
    const [filteredEmail, setFilteredEmail] = useState([]);
    const [filterType, setFilterType] = useState("All");
    const [singleId, setSingleId] = useState("")
    const activePage = 10;

    const handlePageClick = async (event) => {
        const selectedPage = event.selected + 1;
        setPage(selectedPage);
        await fetchEmailData(selectedPage);
    };

    const fetchEmailData = async (pageNumber = 1) => {
        try {
            const response = await fetch(
                `https://flipkart-email-mock.vercel.app/?page=${pageNumber}`
            );
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            const data = await response.json();
            const updatedEmails = data.list.map((email) => ({
                ...email,
                isRead: false,
                isFavorite: false,
            }));
            setFilteredEmail(updatedEmails)
            setEmail(updatedEmails);
            setPageCount(Math.ceil(data.total / activePage));
            setItemoffset((pageNumber - 1) * activePage);
        } catch (error) {
            console.error("Failed to fetch email data:", error);
        }
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
        switch (type) {
            case "Favorites":
                setFilteredEmail(email.filter((mail) => mail.isFavorite));
                break;
            case "Read":
                setFilteredEmail(email.filter((mail) => mail.isRead));
                break;
            case "Unread":
                setFilteredEmail(email.filter((mail) => !mail.isRead));
                break;
            default:
                setFilteredEmail(email);
        }
    };

    const toggleFavoriteStatus = (id) => {
        const updatedEmails = email.map((mail) =>
            mail.id === id ? { ...mail, isFavorite: !mail.isFavorite } : mail
        );
        console.log(updatedEmails);
        setEmail(updatedEmails);
        handleFilterChange(filterType);
        alert("Add to Favourite!")
    };

    useEffect(() => {
        fetchEmailData(page);
    }, [page]);
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };
    const getsingledata = async (id, name, date, subject) => {
        try {
            setClicked(true)
            setClickedEmailId(id)
            setSingledataname(name)
            setDate(date)
            setSubject(subject)
            setSingleId(id)
            const response = await fetch(`https://flipkart-email-mock.vercel.app/?id=${id}`)
            if (!response.ok) {
                console.log("something went wrong");
            }
            const data = await response.json();
            setSingledat(data)

            const updatedEmails = email.map((mail) =>
                mail.id === id ? { ...mail, isRead: !mail.isRead } : mail
            );
            setEmail(updatedEmails);
            handleFilterChange(filterType);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between mb-3">
                    <button onClick={() => handleFilterChange("All")} className="btn btn-primary">
                        All
                    </button>
                    <button onClick={() => handleFilterChange("Favorites")} className="btn btn-secondary">
                        Favorites
                    </button>
                    <button onClick={() => handleFilterChange("Read")} className="btn btn-success">
                        Read
                    </button>
                    <button onClick={() => handleFilterChange("Unread")} className="btn btn-warning">
                        Unread
                    </button>
                </div>
                <div className={`${clicked ? "col-md-4 mt-3" : "col-md-12 mt-4"}`}>
                    {filteredEmail.length > 0 ? (
                        filteredEmail.map((data) => (
                            <div
                                key={data.id}
                                className={`d-flex mb-4 ${clickedEmailId === data.id ? 'bg-light' : ''}`}
                                onClick={() =>
                                    getsingledata(data.id, data.from.name, data.date, data.subject, data.body)
                                }
                                style={{

                                    border: `${clickedEmailId === data.id && clicked ? "1px solid #E54065" : "1px solid #CFD2DC"}`,
                                    borderRadius: "10px",
                                    padding: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                <div
                                    className="mr-3"
                                    style={{
                                        borderRadius: "50%",
                                        width: "50px",
                                        height: "50px",
                                        backgroundColor: "#E54065",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <h1 className="text-white">
                                        {data.from.name.charAt(0).toUpperCase()}
                                    </h1>
                                </div>
                                <div className="col-md-8 p-2">
                                    <span style={{ color: "#636363" }}>From: {data.from.email}</span>
                                    <br />
                                    <span style={{ color: "#636363" }}>Subject: {data.subject}</span>
                                    <br />
                                    <span style={{ color: "#636363" }}>
                                        {data.short_description.length > 40 ? `${data.short_description.substring(0, 10)}...` : data.short_description}
                                    </span>
                                    <br />
                                    <span style={{ color: "#636363" }}>
                                        {formatDateTime(data.date)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-md-12 text-center">No emails available.</div>
                    )}
                </div>
                {
                    clicked ?
                        <div className="col-md-8 d-flex mt-3" style={{ border: "1px solid #CFD2DC", height: "1220px" }}>
                            {clickedEmailId && (
                                <>
                                    <div className="col-md-2 mt-3" style={{
                                        borderRadius: "100%",
                                        width: "50px",
                                        height: "50px",
                                        backgroundColor: "#E54065",
                                    }}>
                                        <h1 className="text-center">{singledataname.charAt(0).toUpperCase()}</h1>
                                    </div>
                                    <div className="mb-4 p-3">
                                        <div className="col-md-12 d-flex">
                                            <div className="col-md-4">
                                                <h2>{subject}</h2>
                                                <span style={{ color: "#636363" }}>{singledataname}</span>
                                                <br />
                                                <span style={{ color: "#636363" }}>
                                                    {formatDateTime(date)}
                                                </span>
                                            </div>
                                            <div>
                                                <button
                                                    className={`btn btn-sm btn-outline-danger mt-2 ml-4`}
                                                    onClick={(e) => toggleFavoriteStatus(singleId)}
                                                >
                                                    Favorite
                                                    {/* {email.map((data) => data.isFavorite) ? "Unfavorite" : "Favorite"} */}
                                                </button>
                                            </div>
                                        </div>

                                        <br />
                                        <div style={{ marginTop: "20px" }}>
                                            <p>{parse(`${singledata.body}`)}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        : ""
                }
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                className="react-paginate"
                activeClassName="selected"
                disabledClassName="disabled"
                previousClassName="previous"
            />
        </div>
    );
};

export default EmailPage;
