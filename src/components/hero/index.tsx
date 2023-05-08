// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Container, createStyles, rem, Title, Image, FileInput, ColorPicker, Button } from '@mantine/core';
import { IconFaceId } from '@tabler/icons-react';
import { useState } from 'react';


const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export function Hero() {
  const { classes } = useStyles();
  const [previewImage, setPreviewImage] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [colorSwatches, setColorSwatches] = useState(['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14'])


  const onImageChange = (file: any) => {
    setPreviewImage(URL.createObjectURL(file));
  }

  const onBgColorChange = (color: any) => {
    setBgColor(color);
  }

  return (
    <Container>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Welcome To Color Analyser
          </Title>

          {previewImage && (
            <div style={{ height: '500px', width: '100%', backgroundColor: `${bgColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image maw={240} mah={240} mx="auto" radius="md" src={previewImage} alt="Image" />
            </div>

          )}
          <FileInput label="Upload Image" placeholder="Click & Choose File" onChange={onImageChange} icon={<IconFaceId size={rem(14)} />} />

          <ColorPicker
            swatchesPerRow={7}
            format="hex"
            swatches={colorSwatches}
            onChange={onBgColorChange}
            size='xl' />

          <Button onClick={(() => setColorSwatches(prev => [...prev, bgColor]))}>Add Color</Button>

        </div>
      </div>
    </Container >
  );
}
