import { IKImage } from 'imagekitio-react';

interface Props {
    item: { image: string };
    width: number;
}

const CarouselItems = ({ item, width }: Props) => {
    return (
        <IKImage
            path={`site/${item.image}`}
            transformation={[
                {
                    width: width - 10 < 1000 ? `${width} - 10` : `1000`,
                    height: '500',
                },
            ]}
            style={{ height: '20%' }}
        />
    );
};

export default CarouselItems;
