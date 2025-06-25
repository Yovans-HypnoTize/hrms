import { Box } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useAppStateAPI } from '../common/AppStateAPI';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const PreloaderBackdrop: React.FC = () => {
    const classes = useStyles();

    const { processingRequests } = useAppStateAPI();

    return (
        <Box zIndex="tooltip">
            <Backdrop className={classes.backdrop} open={processingRequests > 0}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}

export default PreloaderBackdrop;