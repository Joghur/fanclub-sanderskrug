import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const FormInputSelect = ({ value, label, onChange, menuItems }) => {
    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label={label}
                onChange={onChange}
            >
                {menuItems.map((e: { menuItemvalue: string; menuItemLabel: string }) => (
                    <MenuItem key={e.menuItemvalue} value={e.menuItemvalue}>
                        {e.menuItemLabel}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FormInputSelect;
