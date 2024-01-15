"use client";

import { rem } from "@mantine/core";
import { Icon } from "@tabler/icons-react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";


const iconStyle = {width: rem(19), height: rem(19)};

interface MenuListItemProps {
    Icon: Icon,
    href?: string,
    expanded: boolean,
    onClick?: () => void,
    primary?: React.ReactNode,
    secondary?: React.ReactNode,
    secondaryAction?: React.ReactNode,
}

export default function MenuListItem({expanded, primary, secondary, href, onClick, Icon, secondaryAction}:MenuListItemProps) {
    return (
        <ListItem disablePadding sx={{ display: 'block' }} secondaryAction={expanded ? secondaryAction : null}>
            <ListItemButton LinkComponent={href ? Link : undefined} href={`${href ? href : ""}`} onClick={onClick} sx={{
                minHeight: 48,
                justifyContent: expanded ? 'initial' : 'center',
                px: 2.5,
            }}>
                <ListItemIcon sx={{
                    minWidth: 0,
                    mr: expanded ? 3 : 'auto',
                    justifyContent: 'center',
                }}>
                    <Icon style={iconStyle}/>
                </ListItemIcon>
                <ListItemText primary={primary} secondary={secondary} sx={{ opacity: expanded ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
    );
}