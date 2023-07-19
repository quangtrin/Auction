import { createUseStyles } from "react-jss";
export const HeaderStyles = createUseStyles({
    layoutHeader: {
        boxShadow: "0px 5px 20px 0 rgb(0 0 0 / 15%)",
        position: "fixed",
        width: "100%",
        display: "flex",
        alignItems: "center",
        top: 0,
        borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
        zIndex: 2,
        background: "white"
    },
    layoutLogo: {
        width: "65%",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px"
    },
    layoutMenu: {
        // position: "absolute",
        width: "25%",
        // right: "0"
    },
    layoutBtnConnect: {
        width: "10%",
        textAlign: "center"
    },
    currentAccount: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: "20px",
        background: "#1677FF",
        padding: "7px 5px",
        color:"white",
        borderRadius: "5px"
    }
})