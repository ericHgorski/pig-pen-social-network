import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";
import Typography from "@material-ui/core/Typography";

export default function Profile(props) {
    // Wait until userInfo is defined before rendering.
    if (!props.userInfo) {
        return null;
    }
    const { first, last, image_url, bio } = props.userInfo;
    return (
        <>
            <Typography variant="h2">
                {first} {last}
            </Typography>
            <Typography>
                Click on your profile picture to upload a new one
            </Typography>
            <ProfilePic
                toggleUploader={props.toggleUploader}
                first={first}
                last={last}
                image_url={image_url}
            />

            {!props.uploaderStatus && (
                <BioEditor saveBio={props.saveBio} bio={bio} />
            )}
        </>
    );
}
