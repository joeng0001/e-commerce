import {Snackbar,Alert} from '@mui/material';

export default function ButtonList(props) {
    const vertical='top',horizontal='center';//position param of snack bar
    return (
            <Snackbar open={props.openSnackBar} autoHideDuration={8000} onClose={props.closeSnackBar} anchorOrigin={{vertical , horizontal}}>
                <Alert onClose={props.closeSnackBar} severity={props.severity?"success":"error"} sx={{ width: '100%' }}>
                    {props.message}
                </Alert>
            </Snackbar> 
    );

}