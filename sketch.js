/*
* Please press any key to change the random face image on the left.
* Move the mouse to the right to see the average of every face
* As the mouse moves to the left, it looks more like whichever randomly
* chosen face is on the left. You may need to allow a few moments for the 
* sketch to update after the mouse is moved.
*/

var imgs = [];
var avgImg;
var lerpImg;
var numOfImages = 30;
var index = [];
var sumR,sumG,sumB;
//create an array to store each of the images randomly
var rand = [];
var currentImg;
var mouselerp;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    for (var i =0; i < numOfImages; i++){
        filename = "assets/" + i + ".jpg"
        imgs.push(loadImage(filename))
    }
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgs[0].width*2, imgs[0].height);
    pixelDensity(1);

    avgImg = createGraphics(imgs[0].width, imgs[0].height)
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);

    //add each face image into the previous created array
    for(i=0;i<30;i++){
        append(rand,i)
    }
    //set currentImg variable to be a random face image
    currentImg = random(rand)
    //display the random face image on the left of the canvas
    image(imgs[currentImg],0,0);
    
    //load pixels for all face images 
    for(var i=0;i<imgs.length;i++){
        imgs[i].loadPixels(); 
    }
    //load pixels for average image 
    avgImg.loadPixels();
    
    
    for (i=0;i<imgs[0].width;i++){ 
        for (j=0;j<imgs[0].height;j++){
            index = (imgs[0].width * j + i)*4
            sumR = 0
            sumG = 0
            sumB = 0
            avgImg.pixels[index] = 255
            for(x=0;x<imgs.length;x++){
                sumR += imgs[x].pixels[index]
                sumG += imgs[x].pixels[index+1]
                sumB += imgs[x].pixels[index+2]
            }

            //apply RGB values divided by each image to find average
             avgImg.pixels[index]=sumR/imgs.length
             avgImg.pixels[index+1]=sumG/imgs.length
             avgImg.pixels[index+2]=sumB/imgs.length
             avgImg.pixels[index+3]=255

        }
    }   
    //update pixels and create average image on the right of canvas 
    avgImg.updatePixels();
    image(avgImg,width/2,0);
    //do not loop as this process is computationally heavy
    noLoop();
}
function keyPressed()
{
    //when key is pressed, current image becomes another random image from the array
    //this random image is then displayed on the left of the sketch
    currentImg = random(rand)
    image(imgs[currentImg],0,0);
}
function mouseMoved()
{
    //map the mouseX distance over the canvas between 0 and 1
    //constrain these values 
    amt = map(mouseX,0,width,0,1);
    constrain(amt,0,1);

    //load pixels for the average image and every face in the array
    avgImg.loadPixels();
    for(var i=0;i<imgs.length;i++){
        imgs[i].loadPixels(); 
    }

    for (i=0;i<imgs[0].width;i++){
        for(j=0;j<imgs[0].height;j++){
            index = (imgs[0].width * j + i)*4
            sumR = 0
            sumG = 0
            sumB = 0
            avgImg.pixels[index] = 255
            for(x=0;x<imgs.length;x++){
                sumR += imgs[x].pixels[index]
                sumG += imgs[x].pixels[index+1]
                sumB += imgs[x].pixels[index+2]
            }

            //create the new average image to lerp between the random face displayed on the left 
            //and the actual average calculated in the draw() function, depending on the mapped mouseX value
            avgImg.pixels[index] = lerp(imgs[currentImg].pixels[index],sumR/imgs.length,amt)
            avgImg.pixels[index+1] = lerp(imgs[currentImg].pixels[index],sumG/imgs.length,amt)
            avgImg.pixels[index+2] = lerp(imgs[currentImg].pixels[index],sumB/imgs.length,amt)
        }
    }
    //set opacity to 255 so the image is fully opaque.
    avgImg.pixels[index+3] = 255
    //update the pixels and draw the updated image to the right of the canvas
    avgImg.updatePixels();
    image(avgImg,width/2,0);
}