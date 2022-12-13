import { Component, OnInit, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  ngOnInit() {
    const canvas: any = document.getElementById('canvas'),
      preview: any = document.getElementById('preview'),
      ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 400;

    preview.width = 400;
    preview.height = 400;
    const _that = this;
    function getDominantColor(imageObject) {
      //draw the image to one pixel and let the browser find the dominant color
      ctx.drawImage(imageObject, 0, 0, 400, 400);

      //get pixel color
      const i = ctx.getImageData(200, 200, 400, 400).data;

      console.log(`rgba(${i[0]},${i[1]},${i[2]},${i[3]})`);
      console.log(_that.lightOrDark(`rgba(${i[0]},${i[1]},${i[2]},${i[3]})`));
      console.log(
        '#' +
          ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1)
      );
    }

    // vvv all of this is to just get the uploaded image vvv
    const input: any = document.getElementById('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const image: any = new Image();
        image.onload = function () {
          //shows preview of uploaded image
          preview
            .getContext('2d')
            .drawImage(image, 0, 0, preview.width, preview.height);
          getDominantColor(image);
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    };
  }

 public lightOrDark = (color) => {
    console.log({ color });
    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
      );

      r = color[1];
      g = color[2];
      b = color[3];
    } else {
      // If hex --> Convert it to RGB: http://gist.github.com/983661
      color = +(
        '0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
      );

      r = color >> 16;
      g = (color >> 8) & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {
      return 'light';
    } else {
      return 'dark';
    }
  }
}
