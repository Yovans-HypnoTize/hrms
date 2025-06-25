import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  height: "60%",
  display: "flex",
  flexDirection: "column",
};

type ModalDialogPropsTypes = {
  title?: string,
  open: boolean,
  content?:any,
  handleClose: () => void,
  actionButtons?: any
}

export default function ModalDialog({
  title,
  open,
  content,
  handleClose,
  actionButtons,
}: ModalDialogPropsTypes) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#0e7ad5 ",
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1,
            borderTopRightRadius:10,
            borderTopLeftRadius:10,
            color: "#fff",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Box
            component="span"
            sx={{ mr: 1, cursor: "pointer" }}
            onClick={handleClose}
          >
            X
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 4,
            py: 2,
            scrollbarWidth: "none", 
        "&::-webkit-scrollbar": {
          display: "none", 
        },
          }}
        >
          <Typography
            id="modal-modal-description"
            sx={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {content}
          </Typography>
        </Box>

        {/* Optional Action Buttons */}
        {actionButtons && (
          <Box sx={{ p: 1, borderTop: "1px solid #ddd", textAlign: "right" }}>
            {actionButtons}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
