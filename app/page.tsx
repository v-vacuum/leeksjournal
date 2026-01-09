import MemoryGallery from "./components/memoryGallery";
import { images } from "./data/images";

export default function Home() {
  return (
    <div>
      <MemoryGallery images={images} />
    </div>
  );
}
