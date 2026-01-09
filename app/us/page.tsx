import CustomShapedHoverImage from "../components/custom-shaped-hover-image";
import Header from "../header";
const images = [
  {
    id: 1,
    src: "/durama.png",
    hoverSrc: "/durama-hover.png",
    alt: "durama",
    width: 400,
    height: 450,
  },
  {
    id: 3,
    src: "/lighter.png",
    hoverSrc: "/lighter-hover.png",
    alt: "lighter",
    width: 175,
    height: 450,
  },
  {
    id: 4,
    src: "/miffy-figure.png",
    hoverSrc: "/miffy-figure-hover.png",
    alt: "miffy figure",
    width: 250,
    height: 300,
  },
  {
    id: 5,
    src: "/miffy.png",
    hoverSrc: "/miffy-hover.png",
    alt: "miffy sticky!",
    width: 500,
    height: 600,
  },

  {
    id: 6,
    src: "/leek.png",
    hoverSrc: "/leek-hover.png",
    alt: "leeks!",
    width: 400,
    height: 500,
  },

  {
    id: 7,
    src: "/knife.png",
    hoverSrc: "/knife-hover.png",
    alt: "knfie!",
    width: 700,
    height: 500,
  },
  {
    id: 8,
    src: "/flower.png",
    hoverSrc: "/flower-hover.png",
    alt: "flower!",
    width: 500,
    height: 900,
  },
  {
    id: 9,
    src: "/instax-film.png",
    hoverSrc: "/instax-film-hover.png",
    alt: "instax-film!",
    width: 400,
    height: 600,
  },
  {
    id: 10,
    src: "/mify.png",
    hoverSrc: "/mify-hover.png",
    alt: "miffy pt2!",
    width: 500,
    height: 600,
  },
  {
    id: 11,
    src: "/ferris.png",
    hoverSrc: "/ferris-hover.png",
    alt: "ferris!",
    width: 500,
    height: 500,
  },
  {
    id: 2,
    src: "/pepper.png",
    hoverSrc: "/pepper-hover.png",
    alt: "pepper!",
    width: 600,
    height: 300,
  },
  // Add more images as needed
];

const Gallery = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {images.map((img) => (
        <CustomShapedHoverImage
          key={img.id}
          src={img.src}
          hoverSrc={img.hoverSrc}
          alt={img.alt}
          width={img.width}
          height={img.height}
        />
      ))}
    </div>
  );
};

export default function AboutMe() {
  return (
    <div>
      <Header />
      <Gallery />
    </div>
  );
}
