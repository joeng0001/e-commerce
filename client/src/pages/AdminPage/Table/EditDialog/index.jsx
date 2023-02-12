import {Dialog,DialogTitle,DialogContent,FormControl,Input,FormHelperText,TextField} from '@mui/material';
import './index.css'
export default function EditDialog(props){
    return(
        <Dialog
          open={props.open}
          onClose={props.closeDialog}
          maxWidth='lg'
          fullWidth={true}
          scroll="body"
        >
            <DialogTitle ><div className="EditDialog_title">Editing</div></DialogTitle>
                <DialogContent >
                    <FormControl>
                        <Input  type='file'/>
                        <FormHelperText >need to implement drag and drop file here</FormHelperText>
                        <TextField label="Name" variant="outlined" />
                        {/* <FormHelperText >name</FormHelperText> */}
                        <TextField  label="Price" variant="outlined" />
                        {/* <FormHelperText >price</FormHelperText> */}
                        <TextField  label="stock" variant="outlined" />
                        {/* <FormHelperText >stock</FormHelperText> */}
                    </FormControl>

            </DialogContent>
        </Dialog>
    )
}