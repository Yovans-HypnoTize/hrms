import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import React, { useEffect, useRef, useState } from "react";
import ModalDialog from "./ModalDialog";
import { Box } from "@mui/material";

interface MuiAvatarProps {
  data: any[];
  maxCount: number;
}

const MuiAvatar: React.FC<MuiAvatarProps> = ({ data, maxCount }) => {
  const [open, setOpen] = useState<boolean>(false);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const handleClose = () => setOpen(false);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isExtraAvatar =
      target.innerText.startsWith("+") ||
      target.getAttribute("data-extra") === "true";

    if (isExtraAvatar) {
      setOpen(true);
    }
  };

  useEffect(() => {
    const avatars = groupRef.current?.querySelectorAll(
      ".MuiAvatarGroup-avatar"
    );

    avatars?.forEach((avatar: any) => {
      if (avatar.textContent?.startsWith("+")) {
        avatar.style.cursor = "pointer";
        avatar.addEventListener("click", (event: any) => handleClick(event));
      }
    });
  }, [data]);

  const renderMembers = (
    <Box
      sx={{
        display: "flex",
        flexWrap:'wrap',
        textAlign: "center",
        gap: 2,
      }}
    >
      {data.map((item: any, index: number) => (
        <Box sx={{ mx: 1, justifyContent: "center" }}>
          <Avatar
            alt={item.alt}
            src={item.src !== null ? item.src : item.alt}
            key={index}
            sx={{mx:"auto"}}
          />
          <p>{item.name}</p>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Box component="div" ref={groupRef} onClick={handleClick}>
        <AvatarGroup
          total={data.length}
          spacing="medium"
          max={maxCount}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            "& .MuiAvatar-root": {
              width: 30,
              height: 30,
              fontSize: "0.875rem",
            },
          }}
        >
          {data.map((item: any, index: number) => (
            <Avatar
              alt={item.alt}
              src={item.src !== null ? item.src : item.alt}
              key={index}
              sx={{
                objectFit: "cover",
              }}
            />
          ))}
        </AvatarGroup>
      </Box>
      <ModalDialog
        open={open}
        title={"Members"}
        content={renderMembers}
        handleClose={handleClose}
        actionButtons={
          <>
            <button
              className="view-modal-button"
              onClick={() => {
                handleClose();
              }}
            >
              Close
            </button>
          </>
        }
      />
    </>
  );
};

export default MuiAvatar;
