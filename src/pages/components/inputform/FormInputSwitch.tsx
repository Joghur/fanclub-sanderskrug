import { FormControlLabel, Switch } from '@mui/material';

const FormInputSwitch = ({ name, label, value, onChange, disabled }) => {
    return (
        <FormControlLabel
            control={<Switch checked={value} onChange={onChange} name={name} disabled={disabled} />}
            label={label}
        />
    );
};

export default FormInputSwitch;
