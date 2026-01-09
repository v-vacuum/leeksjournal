import cv2
import numpy as np
from pathlib import Path
import argparse
import shutil

def smooth_image(image_path, mode="round", strength=None):
    if strength is None:
        strength = 12 if mode == "round" else 5

    print(f"Processing: {image_path.name} (mode={mode}, strength={strength})")

    img = cv2.imread(str(image_path), cv2.IMREAD_UNCHANGED)
    if img is None:
        print("  Failed to load")
        return False

    bgr = img[:, :, :3].copy()
    alpha = img[:, :, 3] if img.shape[2] == 4 else np.full((img.shape[0], img.shape[1]), 255, dtype=np.uint8)

    if mode == "round":
        blurred = cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), sigmaX=strength)
        new_alpha = np.where(blurred > 127, 255, 0).astype(np.uint8)

    elif mode == "sharp":
        kernel_size = strength + 6
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
        alpha_closed = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel, iterations=2)
        alpha_opened = cv2.morphologyEx(alpha_closed, cv2.MORPH_OPEN, kernel, iterations=2)
        _, binary = cv2.threshold(alpha_opened, 127, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        new_alpha = np.zeros(alpha.shape, dtype=np.uint8)
        if contours:
            contour = max(contours, key=cv2.contourArea)
            perimeter = cv2.arcLength(contour, True)
            epsilon = (strength / 200.0) * perimeter
            approx = cv2.approxPolyDP(contour, epsilon, True)
            cv2.fillPoly(new_alpha, [approx], 255)
        else:
            new_alpha = alpha_opened

    # Clear background
    bgr[new_alpha == 0] = [0, 0, 0]

    result = np.dstack((bgr, new_alpha))

    success = cv2.imwrite(str(image_path), result)
    print("  Success!" if success else "  Failed")
    return success

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simple smooth - round or sharp")
    parser.add_argument("name", help="Base name e.g. 'shark'")
    parser.add_argument("directory", help="Folder e.g. 'test'")
    parser.add_argument("strength", type=int, nargs="?", help="Optional strength (default 12 for round, 5 for sharp)")
    parser.add_argument("--mode", choices=["round", "sharp"], default="round", help="round = curved, sharp = angled")
    parser.add_argument("--test", action="store_true", help="Test mode: create and process _test copies automatically")

    args = parser.parse_args()

    folder = Path(args.directory)
    if not folder.is_dir():
        print(f"Folder '{args.directory}' not found")
        exit()

    files = [folder / f"{args.name}.png", folder / f"{args.name}-hover.png"]
    files = [f for f in files if f.exists()]

    if not files:
        print("No matching files found")
        exit()

    default_strength = 12 if args.mode == "round" else 5
    used_strength = args.strength if args.strength is not None else default_strength

    print(f"Found: {', '.join(f.name for f in files)}")
    print(f"Mode: {args.mode}, Strength: {used_strength}")

    if args.test:
        print("\nTEST MODE: Creating and processing test copies automatically...")
        test_files = []
        for f in files:
            test_path = f.parent / (f.stem + "_test.png")
            shutil.copy(f, test_path)
            test_files.append(test_path)
        files = test_files
        # No confirmation needed in test mode
    else:
        response = input("\nOverwrite original files? Type 'yes': ")
        if response.lower() != 'yes':
            print("Cancelled")
            exit()

    for f in files:
        smooth_image(f, args.mode, used_strength)

    print("\nDone!")
