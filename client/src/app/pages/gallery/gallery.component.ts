import { Component, computed, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

export interface ImageData {
  src: string;
  title: string;
  ratio: number;
}

export interface BrickPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
}

interface BrickLayout {
  data: ImageData;
  position: BrickPosition;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private api: ApiService) {
  }
  @ViewChild('galleryGrid', { static: true }) galleryGrid!: ElementRef<HTMLDivElement>;

  private images = signal<ImageData[]>([]);
  private currentImageIndex = signal<number>(0);
  lightboxActive = signal<boolean>(false);
  private columnCount = signal<number>(5);
  private brickWidth = signal<number>(250);
  private readonly brickGap = 15;

  currentImage = computed(() => {
    const imgs = this.images();
    const index = this.currentImageIndex();
    return imgs[index];
  });

  bricks = computed(() => {
    return this.calculateBrickPositions();
  });

  private resizeListener?: () => void;

  private sampleImages: ImageData[] = [
    { src: 'assets/gallery/manteau_jaune.png', title: 'Tall Portrait', ratio: 1.5 },
    { src: 'assets/gallery/dos_soleil.png', title: 'Wide Landscape', ratio: 0.75 },
    { src: 'assets/gallery/pablo_nico.png', title: 'Perfect Square', ratio: 1.0 },
    { src: 'assets/gallery/petit_drone.png', title: 'Very Tall', ratio: 1.7 },
    { src: 'assets/gallery/close_up_drone.png', title: 'Panoramic', ratio: 0.5 },
    { src: 'assets/gallery/team_gazon.png', title: 'Portrait 2', ratio: 1.33 },
    { src: 'assets/gallery/team_prix.png', title: 'Landscape 2', ratio: 0.7 },
    { src: 'assets/gallery/sunset2.png', title: 'Square 2', ratio: 1.0 },
    { src: 'assets/gallery/drone_gazon.png', title: 'Tall 2', ratio: 1.7 },
    { src: 'assets/gallery/golden_hour.png', title: 'Wide 2', ratio: 0.7 },
    { src: 'assets/gallery/sunset1.png', title: 'Portrait 3', ratio: 1.5 },
    { src: 'assets/gallery/back_hoodie.png', title: 'Landscape 3', ratio: 0.6 },
    { src: 'assets/gallery/speech.png', title: 'Medium Wide', ratio: 0.73 },
    { src: 'assets/gallery/team_golden.png', title: 'Medium Tall', ratio: 1.5 },
    { src: 'assets/gallery/erik-colin.png', title: 'Small Landscape', ratio: 0.8 },
    { src: 'assets/gallery/arm_up.png', title: 'Large Square', ratio: 1.3 },
    { src: 'assets/gallery/table-noire.png', title: 'Small Portrait', ratio: 1.37 },
    { src: 'assets/gallery/gars-assis-gazon.png', title: 'Small Landscape', ratio: 0.68 },
    { src: 'assets/gallery/phil-working.png', title: 'Tall Portrait', ratio: 1.3 }
  ];

  ngOnInit() {
    this.loadImages();
  }
  ngAfterViewInit() {
    this.setupResizeListener();
    this.updateLayout();
    this.loadSampleImages();
    this.setupKeyboardListeners();
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private loadImages() {
    this.api.getGallery().subscribe((data: any) => {
      this.sampleImages = this.sampleImages.map((image, index) => ({
        ...image,
        src: data.images[index],
      })).reverse();
      this.loadSampleImages();
    });
  }

  private setupResizeListener() {
    this.resizeListener = () => {
      this.updateLayout();
    };
    window.addEventListener('resize', this.resizeListener);
  }

  private setupKeyboardListeners() {
    const keyHandler = (e: KeyboardEvent) => {
      if (this.lightboxActive()) {
        switch(e.key) {
          case 'Escape':
            this.closeLightbox();
            break;
          case 'ArrowLeft':
            this.navigateImage(-1);
            break;
          case 'ArrowRight':
            this.navigateImage(1);
            break;
        }
      }
    };
    window.addEventListener('keydown', keyHandler);
  }

  private updateLayout() {
    const newColumnCount = this.getColumnCount();
    const newBrickWidth = this.getBrickWidth(newColumnCount);

    this.columnCount.set(newColumnCount);
    this.brickWidth.set(newBrickWidth);
  }

  private getColumnCount(): number {
    return window.innerWidth <= 768 ? 1 : 5;
  }

  private getBrickWidth(columns: number): number {
    if (!this.galleryGrid) return 250;

    const containerWidth = this.galleryGrid.nativeElement.offsetWidth;
    return Math.max(200, (containerWidth - (this.brickGap * (columns - 1))) / columns);
  }

  private calculateBrickPositions(): Array<{data: ImageData, position: BrickPosition}> {
    const cols = this.columnCount();
    const width = this.brickWidth();
    const gap = this.brickGap;
    const imgs = this.images();

    const columnHeights = new Array(cols).fill(0);
    const results: BrickLayout[]  = [];

    imgs.forEach((imageData, index) => {
      const height = width * imageData.ratio;
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      const x = shortestColumnIndex * (width + gap);
      const y = columnHeights[shortestColumnIndex];

      results.push({
        data: imageData,
        position: {
          x,
          y,
          width,
          height,
          delay: index * 0.1
        }
      });

      columnHeights[shortestColumnIndex] += height + gap;
    });

    const maxHeight = Math.max(...columnHeights);
    if (this.galleryGrid) {
      this.galleryGrid.nativeElement.style.height = `${maxHeight}px`;
    }
    return results;
  }

  private loadSampleImages() {
    this.images.set([...this.sampleImages]);
  }

  openLightbox(imageData: ImageData, index: number) {
    this.currentImageIndex.set(index);
    this.lightboxActive.set(true);
  }

  closeLightbox() {
    this.lightboxActive.set(false);
  }

  navigateImage(direction: number) {
    const imgs = this.images();
    let newIndex = this.currentImageIndex() + direction;

    if (newIndex >= imgs.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = imgs.length - 1;
    }

    this.currentImageIndex.set(newIndex);
  }
}
