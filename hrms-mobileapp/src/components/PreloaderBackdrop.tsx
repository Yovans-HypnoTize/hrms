import * as React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useAppStateAPI } from '../common/AppStateAPI';

const PreloaderBackdrop: React.FC = () => {
    const theme = useTheme();
    const { processingRequests } = useAppStateAPI();

    return (
        <Box sx={{ zIndex: 'tooltip' }}>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: theme.zIndex.drawer + 1,
                }}
                open={processingRequests > 0}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}

export default PreloaderBackdrop;