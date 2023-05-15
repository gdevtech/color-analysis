// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Container, createStyles, rem, Title, Image, FileInput, ColorPicker, Button, Group, Input, Divider } from '@mantine/core';
import { IconFaceId } from '@tabler/icons-react';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { color } from '~/styles/colors';


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
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [colorSwatches, setColorSwatches] = useState([]);
  const [openSaveSwatch, setOpenSaveSwatch] = useState(false);
  const [swatchName, setSwatchName] = useState('');
  const [allSwatchNames, setAllSwatchNames] = useState([]);

  console.log(allSwatchNames);

  const getAllSwatchNames = () => {
    const cookies = document.cookie.split(';');
    const swatchNames = cookies.filter((cookie) => cookie.includes('caSwatch-'));
    const names = swatchNames.map((name) => name.split('=')[0].trim().replace('caSwatch-', ''));
    setAllSwatchNames(names);
    setSwatchByName(swatchName);
  }

  useEffect(() => {
    getAllSwatchNames();
  }, []);

  const setSwatchByName = (name) => {
    const swatch = getSwatch(`caSwatch-${name}`);
    if (swatch) {
      setColorSwatches(swatch);
      setSwatchName(name);
    }
  }


  const saveSwatch = (swatchName, color) => {
    if (openSaveSwatch === false) return;
    const swatch = getSwatch(`caSwatch-${swatchName}`);
    if (swatch) {
      const newSwatch = [...swatch, color];
      setCookie(`caSwatch-${swatchName}`, JSON.stringify(newSwatch), { maxAge: 60 * 60 * 24 * 30 });
      getAllSwatchNames();
    } else {
      setCookie(`caSwatch-${swatchName}`, JSON.stringify([color]), { maxAge: 60 * 60 * 24 * 30 });
      getAllSwatchNames();
    }
  }

  const getSwatch = (swatchName) => {
    const swatch = getCookie(swatchName);
    if (swatch) {
      return JSON.parse(swatch);
    }
  }


  const onImageChange = (file: any) => {
    setPreviewImage(URL.createObjectURL(file));
  }

  const onBgColorChange = (color: any) => {
    setBgColor(color);
  }

  const onInputColorChange = (event) => {
    setBgColor(event.target.value);
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
          {!openColorPicker && (<Input type="color" label="Background Color" value={bgColor} onChange={onInputColorChange} />)}
          {openColorPicker && (
            <ColorPicker
              swatchesPerRow={7}
              format="hex"
              value={bgColor}
              swatches={colorSwatches}
              onChange={onBgColorChange}
              size='xl' />

          )}

          {openSaveSwatch && (<Input type="text" label="Swatch Name" value={swatchName} onChange={(e) => setSwatchName(e.target.value)} />)}

          <Group mt={6}>
            <Button onClick={() => setOpenColorPicker(!openColorPicker)}>{openColorPicker ? 'Close' : 'Open'} Color Picker</Button>
            <Button onClick={() => {
              setOpenSaveSwatch(!openSaveSwatch);
              saveSwatch(swatchName, bgColor);
            }}>
              {openSaveSwatch ? 'Save Swatch' : 'Add Color'}
            </Button>
          </Group>

          <Divider my={'lg'} label='All Saved Swatches' labelPosition='center' />

          {allSwatchNames.map((name) => (
            <Button style={{ backgroundColor: swatchName === name && 'green' }} m={6} onClick={() => setSwatchByName(name)}>{name}</Button>
          ))}

        </div>
      </div>
    </Container >
  );
}
