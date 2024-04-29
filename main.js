import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = 'AIzaSyAUlM3kUC3bQL8L3bwgbzMml8_APTngihE'; // Your API key

  const form = document.getElementById('imageForm');
  const promptInput = document.querySelector('input[name="prompt"]');
  const output = document.querySelector('.output');
  const similar_recipe = document.querySelector('.similar_recipe');
  const output_preview_1 = document.querySelector('.output_preview_1');
  const output_preview_2 = document.querySelector('.output_preview_2');
  const output_preview_3 = document.querySelector('.output_preview_3');
    const extraIngredientsDiv = document.getElementById('extraIngredientsDiv');
  const extraIngredientsInput = document.getElementById('extraIngredients');
  const imageUpload = document.getElementById('imageUpload');
  const cameraInput = document.getElementById('cameraInput');
  const loader = document.getElementById('loader');
  const notfound = document.getElementById('notfound');
  const startgenerate = document.getElementById('startgenerate');
  const uploadedImage = document.getElementById('uploadedImage'); // Added line

  //const edit = document.querySelector('button[name="edit"]');
  const regenerate = document.querySelector('button[name="regenerate"]');
  const submit = document.querySelector('button[name="submit"]');
  const answer = document.querySelector('input[name="answer"]');
  const copy = document.querySelector('button[name="copy"]');

  //preview
  const preview_recipe_1 = document.getElementById('preview_recipe_1');
  const preview_recipe_2 = document.getElementById('preview_recipe_2');
  const preview_recipe_3 = document.getElementById('preview_recipe_3');
.

  copy.addEventListener('click', function () {
    var copyText = output.innerText;
    navigator.clipboard.writeText(copyText);
    alert("Copied!");
  })

  regenerate.addEventListener('click', function () {
    output.innerHTML = '';
    loader.style.display = 'block';
  })

  regenerate.addEventListener('click', function () {
    output.innerHTML = '';
    loader.style.display = 'block';
  })


  async function handleSubmit(file, prompt) {
    loader.style.display = 'block';
    notfound.setAttribute('hidden', 'hidden');
    extraIngredientsDiv.style.display = 'flex';
    incompatible.style.display = 'block';
    startgenerate.setAttribute('hidden', 'hidden');

    try {
      const reader = new FileReader();

      reader.onloadend = async function () {
        let imageBase64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");

        let contents = [
          {
            role: 'user',
            parts: [
              { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
              { text: prompt }
            ]
          }
        ];

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
          ],
        });

        const result = await model.generateContentStream({ contents });

        let buffer = [];
        let md = new MarkdownIt();
        for await (let response of result.stream) {
          buffer.push(response.text());
          output.innerHTML = md.render(buffer.join(''));
        }
      };

      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      output.innerHTML += '<hr>' + e;
    }

    try {
      const reader = new FileReader();

      reader.onloadend = async function () {
        let imageBase64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");

        let contents = [
          {
            role: 'user',
            parts: [
              { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
              { text: "Just the name of the dish name using the same ingredients. Dish name only text 2 words must come from a different country. Do not generate the recipes or ingredients."  }
            ]
          }
        ];

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
          ],
        });

        const result = await model.generateContentStream({ contents });

        let buffer = [];
        let md = new MarkdownIt();
        for await (let response of result.stream) {
          buffer.push(response.text());
          output_preview_1.innerHTML = md.render(buffer.join(''));
        }
      };

      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      output_preview_1.innerHTML += '<hr>' + e;
    }
    try {
      const reader = new FileReader();

      reader.onloadend = async function () {
        let imageBase64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");

        let contents = [
          {
            role: 'user',
            parts: [
              { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
              { text: "Just the name of the dish name using the same ingredients. Dish name only text 2 words must come from a different country. Do not generate the recipes or ingredients." }
            ]
          }
        ];

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
          ],
        });

        const result = await model.generateContentStream({ contents });

        let buffer = [];
        let md = new MarkdownIt();
        for await (let response of result.stream) {
          buffer.push(response.text());
          output_preview_2.innerHTML = md.render(buffer.join(''));
        }
      };

      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      output_preview_2.innerHTML += '<hr>' + e;
    }

    try {
      const reader = new FileReader();

      reader.onloadend = async function () {
        let imageBase64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");

        let contents = [
          {
            role: 'user',
            parts: [
              { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
              { text: "Just the name of the dish name using the same ingredients. Dish name only text 2 words must come from a different country. Do not generate the recipes or ingredients." }
            ]
          }
        ];

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
          ],
        });

        const result = await model.generateContentStream({ contents });

        let buffer = [];
        let md = new MarkdownIt();
        for await (let response of result.stream) {
          buffer.push(response.text());
          output_preview_3.innerHTML = md.render(buffer.join(''));
        }
      };

      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      output_preview_3.innerHTML += '<hr>' + e;
    }


  }

  form.onsubmit = (ev) => {
    ev.preventDefault();

    const imageFile = imageUpload.files[0] || cameraInput.files[0];
    if (imageFile) {

      //Format UI Elements before the prompt is generated
      loader.style.display = 'none';
      extraIngredientsDiv.style.display = 'block';
      uploadedImage.style.display = 'none'; // Hide uploaded image when submitting new image
      handleSubmit(imageFile, promptInput.value);


      //Format UI Elements AFTER THE PROMPT IS GENERATED
      similar_recipe.removeAttribute('hidden');
      regenerate.removeAttribute('hidden');
      copy.removeAttribute('hidden');
      submit.setAttribute('hidden', 'hidden');
    } else {
      notfound.removeAttribute('hidden');
      startgenerate.setAttribute('hidden', 'hidden');
    }
  };
  imageUpload.addEventListener('change', () => {
    if (imageUpload.files.length > 0) {
      cameraInput.value = '';
    }
  });

  cameraInput.addEventListener('change', () => {
    if (cameraInput.files.length > 0) {
      imageUpload.value = '';
    }
  });

  maybeShowApiKeyBanner(API_KEY);

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('rotate'); // Toggle rotate class
  });

  const typingText = document.getElementById('typing-text');
  const prefix = "Hello!\n"; // Define the fixed prefix with a newline
  const suffix = "How can I help you today?"; // Define the dynamic suffix
  let index = 0;
  let direction = 1; // 1 for forward, -1 for reverse

  function type() {
    if (direction === 1) {
      typingText.textContent = prefix + suffix.substring(0, index);
      index++;
      if (index === suffix.length + 1) {
        direction = -1; // Change direction to reverse
      }
    } else {
      typingText.textContent = prefix + suffix.substring(0, index);
      index--;
      if (index === 0) {
        direction = 1; // Change direction to forward
      }
    }
  }

  setInterval(type, 100); // Adjust typing speed (milliseconds) as needed

  // Handle image upload change event to display the uploaded image
  imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = 'block'; // Show uploaded image
      };
      reader.readAsDataURL(file);
    }
  });

  // After handling the image upload, for example, in handleSubmit function
  document.getElementById('uploadedImage').style.display = 'block';

  // Handle camera input change event to hide the uploaded image
  cameraInput.addEventListener('change', () => {
    uploadedImage.style.display = 'none'; // Hide uploaded image when camera input is used
  });

  // Existing functions...
  async function updateRecipe() {
    const extraIngredients = extraIngredientsInput.value;
    if (!extraIngredients) {
      alert("Please enter additional ingredients.");
      return;
    }
    // Append extra ingredients to the prompt and re-submit to AI
    promptInput.value += "Include the following ingredients: ";
    promptInput.value += `, ${extraIngredients}`;
    console.log(promptInput.value);
    const file = imageUpload.files[0] || cameraInput.files[0];
    if (file) {
      handleSubmit(file, promptInput.value);
    }
  }

  async function previewRecipe(recipeName) {
    // Append extra ingredients to the prompt and re-submit to AI
    promptInput.value = "Generate a recipe of " + recipeName + ", the name of the recipe you have provided, the nutritional facts of the recipe and the meal size (estimation of how many number of people it can cater to):";
    const file = imageUpload.files[0] || cameraInput.files[0];
    if (file) {
      handleSubmit(file, promptInput.value);
      console.log('Generate a recipe of: ' + recipeName);
    }
  }

  const updateButton = document.getElementById('updateButton');
  updateButton.addEventListener('click', updateRecipe);
  preview_recipe_1.addEventListener('click', () => previewRecipe(output_preview_1.innerHTML.toString()));
  preview_recipe_2.addEventListener('click', () => previewRecipe(output_preview_2.innerHTML.toString()));
  preview_recipe_3.addEventListener('click', () => previewRecipe(output_preview_3.innerHTML.toString()));

  async function callWithRetry(apiFunction, maxAttempts = 3) {
    let attempts = 0;
    while (attempts < maxAttempts) {
      try {
        return await apiFunction();
      } catch (error) {
        if (error.message.includes("Rpc timed out") && attempts < maxAttempts - 1) {
          attempts++;
        } else {
          throw error;
        }
      }
    }
  }
});