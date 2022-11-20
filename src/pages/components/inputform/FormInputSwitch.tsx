import { FormControlLabel, Switch } from '@mui/material';

const FormInputSwitch = ({ name, label, value, onChange }) => {
    return <FormControlLabel control={<Switch checked={value} onChange={onChange} name={name} />} label={label} />;
};

export default FormInputSwitch;
