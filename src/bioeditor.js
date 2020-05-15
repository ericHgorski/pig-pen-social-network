import React, { useState, useEffect } from "react";
import axios from "./axios";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    textArea: {
        marginTop: "20px",
        marginLeft: "10px",
        gridColumn: "1 / -1 ",
        fontSize: "15px",
    },
    bioEditorContainer: {
        display: "grid",
        gridTemplateRows: "180px 30px",
        gridTemplateColumns: "150px 75px",
        gap: "5px",
    },
    buttons: {
        marginLeft: "10px",
        gridRow: 2,
    },
}));

export default function BioEdtior(props) {
    const [editMode, setEditMode] = useState(false);
    const [draftBio, setDraftBio] = useState(null);
    const classes = useStyles();

    const onChangeHandler = (e) => {
        setDraftBio(e.target.value);
    };

    async function setBio() {
        setEditMode(!editMode);
        try {
            const { data } = await axios.post("/save-bio", { draftBio });
            if (data.success) {
                setDraftBio(data.newBio);
            }
        } catch (err) {
            console.log("Error in axios/post/save-bio: ", err);
        }
    }

    return (
        <>
            <div>
                {editMode ? (
                    <div className={classes.bioEditorContainer}>
                        <TextareaAutosize
                            className={classes.textArea}
                            name="draftBio"
                            defaultValue={props.bio}
                            onChange={onChangeHandler}
                            rowsMin={8}
                            placeholder="Max 500 characters"
                        />
                        <Button
                            className={classes.buttons}
                            variant="contained"
                            color="primary"
                            onClick={setBio}
                        >
                            SAVE BIO
                        </Button>
                        <Button
                            className={classes.buttons}
                            variant="contained"
                            onClick={() => setEditMode(!editMode)}
                        >
                            CANCEL
                        </Button>
                    </div>
                ) : props.bio ? (
                    <Typography variant="h6">
                        About me: {draftBio || props.bio}
                        <br></br>
                        <Button
                            className={classes.buttons}
                            variant="contained"
                            color="primary"
                            onClick={() => setEditMode(!editMode)}
                        >
                            EDIT BIO
                        </Button>
                    </Typography>
                ) : (
                    <div id="add-bio">
                        <Button
                            onClick={setBio}
                            className={classes.buttons}
                            variant="contained"
                            color="primary"
                            onClick={() => setEditMode(!editMode)}
                        >
                            ADD BIO
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
