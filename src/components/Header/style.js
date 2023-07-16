import { createUseStyles } from "react-jss";
export const HeaderStyles = createUseStyles({
    layoutHeader: {
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px - 1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        position: "fixed",
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        height: "45px"
    },
    layoutLogo: {
        width:"75%",
        borderBottom: "1px solid rgba(5, 5, 5, 0.06)"
    },
    layoutMenu: {
        position: "absolute",
        width: "25%",
        right: "0"
    }
})