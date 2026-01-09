// app/me/page.tsx

import MemoryGallery from "../components/memoryGallery"; // gallery.tsx is in components/
import { images } from "../data/images";

export default function MePage() {
  return <MemoryGallery images={images} />;
}
