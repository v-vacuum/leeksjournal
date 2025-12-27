import CustomShapedHoverImage from "./components/custom-shaped-hover-image";
import Header from "./header";
import MemoryGallery from "./components/memoryGallery";
import { images } from "./data/images";

// const images = [
//   {
//     id: 6,
//     src: "/shark.png",
//     hoverSrc: "/shark-hover.png",
//     alt: "shark",
//     width: 500,
//     height: 500,
//   },
//   {
//     id: 5,
//     src: "/photo-strip.png",
//     hoverSrc: "/photo-strip-hover.png",
//     alt: "photo strip",
//     width: 225,
//     height: 550,
//   },
//   {
//     id: 3,
//     src: "/pages.png",
//     hoverSrc: "/pages-hover.png",
//     alt: "pages bookmark",
//     width: 200,
//     height: 550,
//   },
//   {
//     id: 4,
//     src: "/lego-gengar.png",
//     hoverSrc: "/lego-gengar-hover.png",
//     alt: "lego genger",
//     width: 450,
//     height: 600,
//   },
//   {
//     id: 2,
//     src: "/suki-car.png",
//     hoverSrc: "/suki-car-hover.png",
//     alt: "suki's cunty car",
//     width: 550,
//     height: 500,
//   },
//   {
//     id: 1,
//     src: "/warhammer.png",
//     hoverSrc: "/warhammer-hover.png",
//     alt: "warhammer receipt",
//     width: 200,
//     height: 500,
//   },
//   {
//     id: 7,
//     src: "/mira.png",
//     hoverSrc: "/mira-hover.png",
//     alt: "mira's birthday letter",
//     width: 400,
//     height: 550,
//   },
//   {
//     id: 10,
//     src: "/shots.png",
//     hoverSrc: "/shots-hover.png",
//     alt: "german shots",
//     width: 400,
//     height: 550,
//   },
//   {
//     id: 8,
//     src: "/cindy-kitty.png",
//     hoverSrc: "/cindy-kitty-hover.png",
//     alt: "cindy's hello kitty haiku",
//     width: 400,
//     height: 300,
//   },
//   {
//     id: 9,
//     src: "/matt-kitty.png",
//     hoverSrc: "/matt-kitty-hover.png",
//     alt: "matt's hello kitty haiku",
//     width: 400,
//     height: 400,
//   },
//   {
//     id: 11,
//     src: "/tree.png",
//     hoverSrc: "/tree-hover.png",
//     alt: "telus spark card",
//     width: 300,
//     height: 400,
//   },
//   {
//     id: 12,
//     src: "/wifey.png",
//     hoverSrc: "/wifey-hover.png",
//     alt: "wifey's card to me <3",
//     width: 400,
//     height: 300,
//   },
//   // Add more images as needed
// ];

// const Gallery = () => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: "24px",
//         justifyContent: "center",
//         padding: "20px",
//       }}
//     >
//       {images.map((img) => (
//         <CustomShapedHoverImage
//           key={img.id}
//           src={img.src}
//           hoverSrc={img.hoverSrc}
//           alt={img.alt}
//           width={img.width}
//           height={img.height}
//         />
//       ))}
//     </div>
//   );
// };

export default function Home() {
  return (
    <div>
      <MemoryGallery images={images} />
    </div>
  );
}
