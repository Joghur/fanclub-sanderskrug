import { Stack } from '@mui/system';
import { IKImage } from 'imagekitio-react';

import { screenWidth } from 'src/pages/utils/dimensions';

interface Props {
    item: { image: string };
    containerWidth: number;
}

const CarouselItems = ({ item, containerWidth }: Props) => {
    let portrait = false;

    const _width = Math.floor(containerWidth);

    if (item.image.includes('SandersKrug5') || item.image.includes('SandersKrug6')) {
        portrait = true;
    }

    const wantedHdWidth = 1000;
    const hdWidth = portrait ? wantedHdWidth / 1.46 : wantedHdWidth;
    const hdheight = portrait ? wantedHdWidth : wantedHdWidth / 1.46;
    const mobileWidth = portrait ? _width / 1.46 - 10 : _width - 10;
    const mobileHeight = portrait ? _width - 10 : _width / 1.46 - 10;

    const isMobile = _width - 10 < 1000;
    const usedWidth = isMobile ? mobileWidth : hdWidth;
    const usedHeight = isMobile ? mobileHeight : hdheight;

    return (
        <Stack alignItems="center">
            <IKImage
                path={`site/${item.image}`}
                transformation={[
                    {
                        width: `${usedWidth}`,
                        height: `${usedHeight}`,
                    },
                ]}
                loading="lazy"
                height={`${usedHeight}`}
                width={`${usedWidth}`}
            />
        </Stack>
    );
};

export default CarouselItems;
