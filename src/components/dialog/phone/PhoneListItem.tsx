"use client";

import { rem } from "@mantine/core";
import Telefone from "@/model/Telefone";
import { useCallback, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { IconPhone, IconTrash } from "@tabler/icons-react";
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface PhoneListItemProps {
    telefone: Telefone,
    handleDelete: (telefone: Telefone, setLoading: (loading: boolean) => void) => void,
}

export default function PhoneListItem({telefone, handleDelete}:PhoneListItemProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const onDelete = useCallback((evt:React.MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        handleDelete(telefone, setLoading);
    }, [handleDelete, telefone]);
    
    return (
        <ListItem disablePadding secondaryAction={
        loading ? (
            <ThreeDots
                visible={true}
                height="20"
                width="20"
                color="#f00"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        ) : (
            <IconButton onClick={onDelete} color="error">
                <IconTrash style={{width: rem(20), height: rem(20)}}/>
            </IconButton>
        )}>
            <ListItemButton>
                <ListItemIcon>
                    <IconPhone style={{width: rem(20), height: rem(20)}}/>
                </ListItemIcon>
                <ListItemText primary={telefone.numero}/>
            </ListItemButton>
        </ListItem>
    )
}
