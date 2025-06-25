import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

const ConfirmDialog: React.FC<{ showConfirm: boolean, handleYes: any, handleNo: any, confirmHeading: string, confirmMsg: string }> = ({ showConfirm, handleYes, handleNo, confirmHeading, confirmMsg }) => {

    return (
        <Dialog
            open={showConfirm}
            onClose={handleNo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {confirmHeading}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {confirmMsg}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleNo}>No</Button>
                <Button onClick={handleYes} autoFocus>Yes</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;