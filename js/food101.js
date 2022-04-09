//Display image uploaded by user
function display(event) {
    let input_image = document.getElementById("input_image")
    input_image.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById("input_image_container").style.display = "block";
}

//Predict emotion and display output
async function predict_emotion() {
    document.getElementById("output_text").innerHTML = "<p>Predicting.....</p>";
    let input = document.getElementById("input_image");
    //Preprocessing steps 
    /*
    (1)Resize to 48*48
    (2)Convert to grayscale using simple mean
    (3)Convert to float
    (4)Reshape to (1,224, 224,1)
    (5)Normalize by dividing by 255.0
    */
    let step1 = tf.browser.fromPixels(input).resizeNearestNeighbor([224, 224]).toFloat().expandDims(0);//.div(255.0);
    const model = await tf.loadGraphModel('https://raw.githubusercontent.com/Google987/arif-folio/master/model/model.json');
    pred = model.predict(step1)
    // pred.print()
    // console.log("End of predict function")
    //This array is encoded with index i = corresponding emotion. In dataset, 0 = Angry, 1 = Disgust, 2 = Fear, 3 = Happy, 4 = Sad, 5 = Surprise and 6 = Neutral
    emotions = ['apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare', 'beet_salad', 'beignets', 'bibimbap', 'bread_pudding', 'breakfast_burrito', 'bruschetta', 'caesar_salad', 'cannoli', 'caprese_salad', 'carrot_cake', 'ceviche', 'cheesecake', 'cheese_plate', 'chicken_curry', 'chicken_quesadilla', 'chicken_wings', 'chocolate_cake', 'chocolate_mousse', 'churros', 'clam_chowder', 'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes', 'deviled_eggs', 'donuts', 'dumplings', 'edamame', 'eggs_benedict', 'escargots', 'falafel', 'filet_mignon', 'fish_and_chips', 'foie_gras', 'french_fries', 'french_onion_soup', 'french_toast', 'fried_calamari', 'fried_rice', 'frozen_yogurt', 'garlic_bread', 'gnocchi', 'greek_salad', 'grilled_cheese_sandwich', 'grilled_salmon', 'guacamole', 'gyoza', 'hamburger', 'hot_and_sour_soup', 'hot_dog', 'huevos_rancheros', 'hummus', 'ice_cream', 'lasagna', 'lobster_bisque', 'lobster_roll_sandwich', 'macaroni_and_cheese', 'macarons', 'miso_soup', 'mussels', 'nachos', 'omelette', 'onion_rings', 'oysters', 'pad_thai', 'paella', 'pancakes', 'panna_cotta', 'peking_duck', 'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib', 'pulled_pork_sandwich', 'ramen', 'ravioli', 'red_velvet_cake', 'risotto', 'samosa', 'sashimi', 'scallops', 'seaweed_salad', 'shrimp_and_grits', 'spaghetti_bolognese', 'spaghetti_carbonara', 'spring_rolls', 'steak', 'strawberry_shortcake', 'sushi', 'tacos', 'takoyaki', 'tiramisu', 'tuna_tartare', 'waffles'];
    let progressBars = document.querySelectorAll(".col-6 .progress .progress-bar");
    //At which index in tensor we get the largest value ?
    pred.data()
        .then((data) => {
            // console.log(data)
            max_val = -1
            max_val_index = -1
            for (let i = 0; i < data.length; i++) {
                if (data[i] > max_val) {
                    max_val = data[i]
                    max_val_index = i
                }
                progressBars[i].style.width = (data[i] * 100).toFixed(2) + "%";
                progressBars[i].innerHTML = (data[i] * 100).toFixed(2) + "%";
            }
            EMOTION_DETECTED = emotions[max_val_index];
            document.getElementById("output_text").innerHTML = "<p>Food detected: " + EMOTION_DETECTED + "(" + (max_val * 100).toFixed(2) + "% probability)</p>";
        })

}