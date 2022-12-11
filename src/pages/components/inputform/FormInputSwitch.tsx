import { FormControlLabel, Switch } from '@mui/material';

interface Props {
    name: string;
    label: string;
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}

const FormInputSwitch = ({ name, label, value, onChange, disabled }: Props) => {
    return (
        <FormControlLabel
            control={<Switch checked={value} onChange={onChange} name={name} disabled={disabled} />}
            label={label}
        />
    );
};

export default FormInputSwitch;
