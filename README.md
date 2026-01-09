# ViviJournal

A personal journaling application built with Next.js and React, designed for capturing memories.

## Features

- **Interactive Image Galleries**: Hover effects and responsive image displays for a dynamic browsing experience
- **Custom Image Processing**: Automated cropping and optimization script to maintain consistent formatting and reduce file sizes

## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the journal.

## Image Processing

To optimize and crop images before upload:

```bash
npm run process-images
```

This script automatically formats images to maintain visual consistency throughout the journal.

## Project Structure

```
vivijournal/
├── app/              # Next.js app directory
├── components/       # React components
├── public/           # Static assets and images
├── scripts/          # Image processing utilities
└── styles/           # Global styles
```

## Deployment

Deployed on Vercel with automatic deployments from the main branch.

Visit the live site: [vivijournal.vercel.app](https://vivijournal.vercel.app)

---

**Built with <3 as a personal project to preserve memories**

---
