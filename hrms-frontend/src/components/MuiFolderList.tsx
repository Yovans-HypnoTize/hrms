import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { ListSubheader, SxProps } from "@mui/material";
import React from "react";

interface MuiFolderListProps {
  data: any;
  subHeading: any;
  subHeaderSx?: SxProps
}

const MuiFolderList: React.FC<MuiFolderListProps> = ({ data, subHeading, subHeaderSx }) => {
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        border: "1px solid rgb(225, 222, 222)",
        borderRadius: 2,
        mt: 3,
        p: 0,
        height: data.length > 5 ? 360 : "auto",
        overflowY: data.length > 5 ? "auto" : "visible",
        scrollbarWidth: "none", 
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <ListSubheader
        sx={{
          ...subHeaderSx,
          borderBottom: "2px solid rgb(237, 235, 235)",
          fontSize: 18,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          position: "static",
          top: 0,
          zIndex: 10,
        }}
      >
        {subHeading}
      </ListSubheader>
      
      {data.length > 0 ? (
        data.map((item: {[k: string]:string}, index: number) => {
          const keys = Object.keys(item);
          const firstKey = keys[0] || "";
          const secondKey = keys[1] || "";
          const thirdKey = keys[2] || "";

          const firstKeyValue = item[firstKey] || "";
          const secondKeyValue = item[secondKey] || "";
          const thirdKeyValue = item[thirdKey] || "";

          return (
            <ListItem key={index} sx={{
              "&:not(:last-child)": {
                borderBottom: "1px solid rgb(225, 222, 222)",
              },
            }}>
              <ListItemText primary={firstKeyValue} secondary={secondKeyValue} />
              <ListItemAvatar>
                {thirdKeyValue && thirdKeyValue.length > 0 ? (
                  <Avatar src={thirdKeyValue} alt="user-img"/>
                ) : (
                  <Avatar>{firstKeyValue.charAt(0).toUpperCase()}</Avatar>
                )}
              </ListItemAvatar>
            </ListItem>
          );
        })
      ) : (
        <ListItem sx={{py:2.5}}>
          <ListItemText primary="No data available" />
        </ListItem>
      )}
    </List>
  );
};

export default MuiFolderList;
