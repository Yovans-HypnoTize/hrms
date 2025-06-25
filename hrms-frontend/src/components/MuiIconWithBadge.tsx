import * as React from "react";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }: any) => ({
    "& .MuiBadge-badge": {
      right: 0,
      top: 5,
      minWidth: "15px", 
      height: "15px", 
      fontSize: "0.60rem",
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: "0 3px",
      lineHeight: 1,
    },
  }));

interface MuiIconWithBadgeProps {
  badgeContent: number;
  badgeColor:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | undefined;
}

const MuiIconWithBadge: React.FC<MuiIconWithBadgeProps> = ({
  badgeColor,
  badgeContent,
}) => {
  return (
    <IconButton aria-label="cart">
      <StyledBadge badgeContent={badgeContent} color={badgeColor}>
        <NotificationsIcon />
      </StyledBadge>
    </IconButton>
  );
};

export default MuiIconWithBadge;
