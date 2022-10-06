var elementsArray = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var name = this.el.getAttribute("name");
      var barcodeValue = this.el.getAttribute("value");
      elementsArray.push({ name: name, barcode_value: barcodeValue });

      combine[barcodeValue]["combine"].map(item => {
        var combine = document.querySelector(`#${item.combine}-${barcodeValue}`);
        combine.setAttribute("visible", false);
      });
    });

    this.el.addEventListener("markerLost", () => {
      var name = this.el.getAttribute("name");
      var index = elementsArray.findIndex(x => x.name === name);
      if (index > -1) {
        elementsArray.splice(index, 1);
      }
    });
  },


  tick: function () {
    if (elementsArray.length > 1) {

      var messageText = document.querySelector("#message-text");

      var length = elementsArray.length;
      var distance = null;

      var combine = this.Combined();

      if (length === 2) {
        var marker1 = document.querySelector(`#marker-${elementsArray[0].barcode_value}`);
        var marker2 = document.querySelector(`#marker-${elementsArray[1].barcode_value}`);

        distance = this.getDistance(marker1, marker2);

        if (distance < 1.25) {
          if (combine !== undefined) {
            this.Combined(combine);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
        }
      }

      if (length === 3) {
        var marker1 = document.querySelector(`#marker-${elementsArray[0].barcode_value}`);
        var marker2 = document.querySelector(`#marker-${elementsArray[1].barcode_value}`);
        var marker3 = document.querySelector(`#marker-${elementsArray[2].barcode_value}`);

        var distance1 = this.getDistance(marker1, marker2);
        var distance2 = this.getDistance(marker1, marker3);

        if (distance1 < 1.25 && distance2 < 1.25) {
          if (compound !== undefined) {
            barcodeValue=elementsArray[0].barcode_value;
            this.Combined(compound, barcodeValue);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
        }
    }
    }
  },
  //Calculate distance between two position markers
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  
  getCompound: function () {
    for (var el of elementsArray) {
      if (A.includes(el.element_name)) {
        var compound = el.element_name;
        for (var i of elementsArray) {
          if (B.includes(i.element_name)) {
            compound += i.element_name;
            return { name: compound, value: el.barcode_value };
          }
          
        }
      }
    }
  },
  Combined: function (combine) {
    elementsArray.map(item => {
      var el = document.querySelector(`#${item.element_name}-${item.barcode_value}`);
      el.setAttribute("visible", false);
    });
    var combine = document.querySelector(`#${combine.name}-${combine.value}`);
    combine.setAttribute("visible", true);
  }
});