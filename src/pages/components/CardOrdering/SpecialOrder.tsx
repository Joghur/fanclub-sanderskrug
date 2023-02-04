import EditIcon from '@mui/icons-material/Edit';
import { Dialog, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';

// import { useSpecialOrder } from 'src/utils/hooks';

import SkeletonComponent from '../SkeletonComponent';

// interface Props {
//     specialOrder: string;
// }

const SpecialOrderComponent = () => {
    const auth = getAuth();
    const theme = useTheme();
    const [showSpecialOrderDialog, setShowSpecialOrderDialog] = useState(false);

    // const [specialOrder, setSpecialOrder, specialOrderLoading] = useSpecialOrder();

    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    // console.log('specialOrder', specialOrder);
    // console.log('specialOrderLoading', specialOrderLoading);

    // if (!specialOrder || specialOrderLoading) {
    //     return <SkeletonComponent />;
    // }

    // const handleChange = second => {
    //     third;
    // };

    // const handleSubmitSpecialOrderInformation = async () => {
    // await setSpecialOrder(old)=>{...old, });
    // setShowSpecialOrderDialog(false);
    // };

    return (
        <Stack alignItems="center" spacing={3} sx={{ py: 5, px: mobile ? 5 : 0, alignItems: 'center' }}>
            {auth.currentUser && <EditIcon onClick={() => setShowSpecialOrderDialog(true)} />}
            {/* {specialOrder && <Typography>{specialOrder.specialOrderInfo}</Typography>} */}
            {auth.currentUser && (
                <Dialog open={showSpecialOrderDialog}>
                    <Paper sx={{ p: 5 }}>
                        <Stack spacing={2}>
                            {/* <Stack direction="row" justifyContent="flex-end"> */}
                            {/* <Button
                                    variant="outlined"
                                    color="info"
                                    onClick={() => changeInformationText(undefined)}
                                >
                                    Leermachen
                                </Button>
                                <CancelIcon
                                    fontSize="large"
                                    sx={{ color: 'red' }}
                                    onClick={() => setShowInformationDialog(false)}
                                />
                            </Stack>
                            <TextareaAutosize
                                aria-label="empty textarea"
                                minRows={3}
                                value={info}
                                onChange={changeInformationText}
                            />
                            <Button variant="contained" onClick={handleSubmitSpecialOrderInformation}>
                                Info ändern
                            </Button> */}
                        </Stack>
                    </Paper>
                </Dialog>
            )}
        </Stack>
    );
};

export default SpecialOrderComponent;
