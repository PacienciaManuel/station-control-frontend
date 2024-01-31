"use client";

import { useCallback, useId, useRef, useState } from "react";
import { rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { Box, Button, InputBase, Menu, MenuItem, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import sessionStorageManager from "@/util/SessionStorageManager";

export default function Search() {
    const router = useRouter();
    const searchPopupId = useId();
    const btnRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setsearch] = useState<string>("");
    const [researches, setResearches] = useState<string[]>(sessionStorageManager.getResearches());

    const onSubmit = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        router.push(`/search?s=${search}`);
        setResearches(sessionStorageManager.addSearch(search));
    }, [router, search]);

    const handleSearchOption = useCallback((search: string, close: () => void) => {
        close();
        setsearch(search);
        router.push(`/search?s=${search}`);
        setResearches(sessionStorageManager.addSearch(search));
    }, [router]);

    return (
        <Stack direction="row" onSubmit={onSubmit} component="form">
            <PopupState variant="popover" popupId={searchPopupId}>
                {(popupState) => (<>
                    <Box component="span" {...bindTrigger(popupState)}>
                        <InputBase 
                            required
                            name="s"
                            ref={inputRef}
                            value={search}
                            type="search" 
                            autoComplete="off"
                            placeholder="Procurar..." 
                            onChange={evt => setsearch(evt.target.value)}
                            startAdornment={<IconSearch style={{width: rem(19), height: rem(19)}}/>} 
                            sx={{
                                gap: 2,
                                width: "100%",
                                maxWidth: 300,
                                padding: "5px 10px",
                                bgcolor: "#464f5b",
                                borderRadius: "5px 0 0 5px",
                                color: theme => theme.palette.primary.contrastText,
                            }}
                        />
                    </Box>
                    <Menu
                        {...bindMenu(popupState)} 
                        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                        transformOrigin={{vertical: "top", horizontal: "left"}}
                        slotProps={{
                            paper: {
                                style: {
                                    maxWidth: 312,
                                    width: "100vw",
                                },
                            }
                        }}
                    >
                        {researches.filter(r => r.trim().toLowerCase().includes(search.trim().toLowerCase())).map((researche, index) => (
                            <MenuItem key={index} onClick={() => handleSearchOption(researche, popupState.close)}>{researche}</MenuItem>
                        ))}
                    </Menu>
                </>)}
            </PopupState>
            <Button ref={btnRef} variant="contained" disableElevation sx={{color: "#f0f8ff", borderRadius: "0 5px 5px 0",}}>Pesquisar</Button>
        </Stack>
    )
}
