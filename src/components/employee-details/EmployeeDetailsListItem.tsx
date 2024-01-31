"use client";

import { rem } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

interface EmployeeDetailsListItemProps {
    Icon: Icon,
    primary?: React.ReactNode,
    secondary?: React.ReactNode,
}

const iconStyle = {width: rem(19), height: rem(19)};

export default function EmployeeDetailsListItem({ Icon, primary, secondary }:EmployeeDetailsListItemProps) {
    return (
        <ListItem disablePadding>
            <ListItemIcon sx={{minWidth: 30, color: theme => theme.palette.primary.contrastText}} >
                <Icon style={iconStyle}/>
            </ListItemIcon> 
            <ListItemText 
                primary={primary} 
                secondary={secondary}
                primaryTypographyProps={{color: theme => theme.palette.primary.contrastText}}
                secondaryTypographyProps={{color: theme => theme.palette.primary.contrastText}}
            />
        </ListItem>
    )
}
