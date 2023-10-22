import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  canClick = true
  data: any[] = [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}, {a: 7}, {a: 8}, {a: 9}, {a: 10}]
  activeIndex: number = 0;
  @ViewChild('carouselRef') carouselRef!: ElementRef<any>
  @ViewChild('rightArrow') rightArrow!: ElementRef<any>

  constructor(private renderer: Renderer2) {
  }


  onClickLeft() {
    this.replaceElements('left')
  }

  onClickRight() {
    this.replaceElements('right')
  }


  replaceElements(direction: 'left' | 'right') {
    if (this.canClick) {
      this.canClick = false
      setTimeout(() => {
        this.canClick = true
      }, 1000);

      const carousel = this.carouselRef.nativeElement
      const first = carousel.childNodes[0]
      const centerLeft = carousel.childNodes[1]
      const center = carousel.childNodes[2]
      const centerRight = carousel.childNodes[3]
      const last = carousel.childNodes[4]

      if (direction === 'left') {
        this.activeIndex = Math.abs(this.activeIndex) >= this.data.length - 1 ? 0 : this.activeIndex + 1
        const index = (Math.abs(this.activeIndex) + 4) % this.data.length

        const newItem = this.data[index]
        const div = this.createElement(newItem, ['last'])

        this.renderer.addClass(first, 'out')
        setTimeout(() => {
          this.renderer.removeChild(carousel, first)
        }, 990)
        this.renderer.appendChild(carousel, div)

        this.renderer.removeClass(centerLeft, 'center')
        this.renderer.removeClass(centerLeft, 'left')
        this.renderer.addClass(centerLeft, 'first')

        this.renderer.addClass(center, 'left')

        this.renderer.removeClass(centerRight, 'right')

        this.renderer.removeClass(last, 'last')
        this.renderer.addClass(last, 'center')
        this.renderer.addClass(last, 'right')

      } else {
        this.activeIndex = 0 >= Math.abs(this.activeIndex) ? this.data.length - 1 : this.activeIndex - 1
        const index = this.activeIndex
        const newItem = index === this.data.length ? this.data[0] : this.data[index]
        const div = this.createElement(newItem, ['first'])


        this.renderer.addClass(last, 'out')
        setTimeout(() => {
          this.renderer.removeChild(carousel, last)
          this.renderer.removeClass(centerRight, 'center')
        }, 990)

        this.renderer.removeClass(first, 'first')
        this.renderer.removeClass(centerLeft, 'left')
        this.renderer.addClass(first, 'center')
        this.renderer.addClass(first, 'left')
        this.renderer.insertBefore(carousel, div, carousel.firstChild);
        this.renderer.addClass(center, 'right')
        this.renderer.removeClass(centerRight, 'right')
        this.renderer.addClass(centerRight, 'last')

      }

    }

  }

  createElement(item: any, classNames: string[]) {
    const div = this.renderer.createElement('div')
    const span = this.renderer.createElement('span')

    span.innerHTML = item.a
    div.classList.add('carousel_item')
    classNames.forEach((className: string) => div.classList.add(className))
    this.renderer.appendChild(div, span)
    return div
  }

  createInitialElements() {
    this.data.forEach((item: any, i: number) => {
      let element;
      switch (i) {
        case  0:
          element = this.createElement(item, ['first'])
          break
        case  1:
          element = this.createElement(item, ['center', 'left'])
          break
        case  2:
          element = this.createElement(item, ['center'])
          break
        case  3:
          element = this.createElement(item, ['center', 'right'])
          break
        case  4:
          element = this.createElement(item, ['last'])
          break
      }
      element && this.renderer.appendChild(this.carouselRef.nativeElement, element)

    })
  }

  ngAfterViewInit(): void {
    this.createInitialElements()
  }

}
