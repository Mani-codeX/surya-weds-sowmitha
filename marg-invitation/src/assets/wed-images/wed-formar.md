# Image Protection & Optimization Guidelines

## Goal

This wedding invitation website contains personal bride and groom photos.

The objective is:

* Maintain premium visual quality.
* Improve website performance.
* Reduce casual image downloading.
* Prevent exposing original high-resolution photos.
* Use optimized web-friendly images.

---

# Image Format

Use:

* WebP format

Avoid:

* Original DSLR JPG files
* RAW files
* Large PNG files

Recommended:

```text
hero.webp
love-story-1.webp
love-story-2.webp
gallery-1.webp
gallery-2.webp
venue.webp
```

---

# Image Export Settings

Recommended export:

```text
Format: WebP
Quality: 80-85
Max Width: 1600px - 1920px
Color Profile: sRGB
```

Do not upload original full-resolution images.

Store original files locally only.

---

# Prevent Casual Downloading

Disable image dragging.

Example:

```jsx
<img
  src={image}
  alt=""
  draggable="false"
/>
```

---

Disable right click on images.

Example:

```jsx
onContextMenu={(e) => e.preventDefault()}
```

---

Disable image selection.

```css
img {
  user-select: none;
  -webkit-user-drag: none;
}
```

---

# Disable Right Click Globally

```jsx
useEffect(() => {
  const handler = (e) => e.preventDefault();

  document.addEventListener("contextmenu", handler);

  return () => {
    document.removeEventListener("contextmenu", handler);
  };
}, []);
```

---

# Optional Protection

Prevent common developer shortcuts.

```jsx
useEffect(() => {
  const handler = (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
      (e.ctrlKey && e.key === "u")
    ) {
      e.preventDefault();
    }
  };

  document.addEventListener("keydown", handler);

  return () => document.removeEventListener("keydown", handler);
}, []);
```

---

# Important Note

These protections only stop casual users.

No website can completely prevent:

* Screenshots
* Browser cache
* Advanced users using DevTools

This is normal web behavior.

---

# Additional Recommendations

Use:

* WebP images only
* Optimized image sizes
* Lazy loading
* Responsive images

Avoid:

* Uploading original DSLR files
* Uploading RAW files
* Large uncompressed PNG files

---

# Wedding Website Strategy

1. Keep original photos locally.
2. Upload only optimized WebP versions.
3. Disable casual download actions.
4. Use premium image presentation and animations.
5. After the wedding event is completed, remove or archive the website if desired.

This provides the best balance between:

* Visual quality
* Performance
* Privacy
* User experience
