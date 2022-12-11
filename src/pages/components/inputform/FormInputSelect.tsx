import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

export interface MenuItem {
    menuItemvalue: string;
    menuItemLabel: string;
}

interface Props {
    label: string;
    value: string;
    onChange: (event: SelectChangeEvent<HTMLInputElement>) => void;
    menuItems: MenuItem[];
}

const FormInputSelect = ({ value, label, onChange, menuItems }: Props) => {
    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value as unknown as HTMLInputElement}
                label={label}
                onChange={onChange}
            >
                {menuItems.map((e: MenuItem) => (
                    <MenuItem key={e.menuItemvalue} value={e.menuItemvalue}>
                        {e.menuItemLabel}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FormInputSelect;
