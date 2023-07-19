import { createUseStyles } from "react-jss";
export const CardTokenStyles = createUseStyles({
    tokenName: {
        fontWeight: "700",
        fontSize: "16px"
    },
    tokenDes: {
        maxHeight: "50px",
        overflowY: "scroll",
        cursor: "pointer",
        padding: "2px",
        "&::-webkit-scrollbar": {
            width: "5px",
        },
        "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
        },

        "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "5px"
        },

        "&::-webkit-scrollbar-thumb:hover": {
            background: "#555"
        },
        "&:hover":{
            boxShadow: "-1px -1px 13px 3px rgba(0,0,0,0.2)"
        }
    },
})