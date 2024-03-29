import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
    header: string;
    alertText: string;
    open: boolean;
    onClose: () => void;
    onAction: () => void;
}

export const AlertDialog = (props: Props) => {
    const { header, alertText, open, onClose, onAction } = props;

    const handleClick = () => {
        onAction();
        onClose();
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{header}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{alertText}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button variant="outlined" onClick={handleClick} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AlertDialog;
