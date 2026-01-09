import os
from PIL import Image

def get_components(mask, min_area):
    """
    Finds connected components in a binary mask (pixels are 0 or 255)
    and returns a list of bounding boxes for those components whose area
    is at least min_area.
    """
    width, height = mask.size
    data = mask.load()
    # Create a 2D visited array
    visited = [[False] * width for _ in range(height)]
    components = []

    for y in range(height):
        for x in range(width):
            if visited[y][x]:
                continue
            if data[x, y] != 255:
                visited[y][x] = True
                continue

            # Start flood fill for a new component.
            stack = [(x, y)]
            comp_pixels = []

            while stack:
                cx, cy = stack.pop()
                if visited[cy][cx]:
                    continue
                visited[cy][cx] = True
                if data[cx, cy] == 255:
                    comp_pixels.append((cx, cy))
                    # Check 4-connected neighbors.
                    if cx > 0 and not visited[cy][cx - 1]:
                        stack.append((cx - 1, cy))
                    if cx < width - 1 and not visited[cy][cx + 1]:
                        stack.append((cx + 1, cy))
                    if cy > 0 and not visited[cy - 1][cx]:
                        stack.append((cx, cy - 1))
                    if cy < height - 1 and not visited[cy + 1][cx]:
                        stack.append((cx, cy + 1))

            # If the component is large enough, add its bounding box.
            if len(comp_pixels) >= min_area:
                xs = [p[0] for p in comp_pixels]
                ys = [p[1] for p in comp_pixels]
                # +1 for right and lower as PIL's crop box is non-inclusive
                bbox = (min(xs), min(ys), max(xs) + 1, max(ys) + 1)
                components.append(bbox)
    return components

def get_visible_bbox(image, min_area_ratio=0.001):
    """
    Computes the union bounding box of all connected regions of visible
    (alpha > 1) pixels whose area exceeds min_area_ratio of the total image area.
    If none are found, returns None.
    """
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    alpha = image.getchannel('A')
    # Build a binary mask: visible pixels become 255, others 0.
    mask = alpha.point(lambda p: 255 if p > 1 else 0)
    width, height = mask.size
    total_area = width * height
    min_area = total_area * min_area_ratio

    components = get_components(mask, min_area)
    if not components:
        return None

    # Union all component bounding boxes.
    left = min(comp[0] for comp in components)
    upper = min(comp[1] for comp in components)
    right = max(comp[2] for comp in components)
    lower = max(comp[3] for comp in components)
    return (left, upper, right, lower)

def union_bbox(bbox1, bbox2):
    """
    Returns the union of two bounding boxes.
    If one is None, returns the other.
    If both are None, returns None.
    """
    if bbox1 is None and bbox2 is None:
        return None
    if bbox1 is None:
        return bbox2
    if bbox2 is None:
        return bbox1
    left = min(bbox1[0], bbox2[0])
    upper = min(bbox1[1], bbox2[1])
    right = max(bbox1[2], bbox2[2])
    lower = max(bbox1[3], bbox2[3])
    return (left, upper, right, lower)

def crop_visible_pixels(image, bbox=None):
    """
    Crops the image to the provided bbox.
    If bbox is None, calculates the visible bbox.
    """
    if bbox is None:
        bbox = get_visible_bbox(image)
    if bbox:
        return image.crop(bbox)
    return image

def process_directory(directory):
    # Group images by their base name (ignoring "-hover" suffix).
    groups = {}
    for filename in os.listdir(directory):
        if filename.lower().endswith('.png'):
            if filename.lower().endswith('-hover.png'):
                base = filename[:-len('-hover.png')]
                groups.setdefault(base, {})['hover'] = filename
            else:
                base = filename[:-len('.png')]
                groups.setdefault(base, {})['normal'] = filename

    for base, group in groups.items():
        if 'normal' in group and 'hover' in group:
            normal_path = os.path.join(directory, group['normal'])
            hover_path = os.path.join(directory, group['hover'])
            try:
                with Image.open(normal_path) as normal_img, Image.open(hover_path) as hover_img:
                    normal_img = normal_img.convert('RGBA')
                    hover_img = hover_img.convert('RGBA')

                    bbox_normal = get_visible_bbox(normal_img)
                    bbox_hover = get_visible_bbox(hover_img)
                    combined_bbox = union_bbox(bbox_normal, bbox_hover)

                    if combined_bbox:
                        normal_cropped = normal_img.crop(combined_bbox)
                        hover_cropped = hover_img.crop(combined_bbox)
                    else:
                        normal_cropped = normal_img
                        hover_cropped = hover_img

                    normal_cropped.save(normal_path)
                    hover_cropped.save(hover_path)
                    print(f"Cropped group: {group['normal']} and {group['hover']}")
            except Exception as e:
                print(f"Error processing group {base}: {e}")
        else:
            filename = group.get('normal') or group.get('hover')
            filepath = os.path.join(directory, filename)
            try:
                with Image.open(filepath) as img:
                    img = img.convert('RGBA')
                    cropped_img = crop_visible_pixels(img)
                    cropped_img.save(filepath)
                    print(f"Cropped: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    process_directory("public")
