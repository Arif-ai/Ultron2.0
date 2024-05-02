// Import necessary modules and styles
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import {
  maybeShowApiKeyBanner
} from './gemini-api-banner';
import './style.css';

// Wait for the DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Define your API key
  const API_KEY = 'AIzaSyAUlM3kUC3bQL8L3bwgbzMml8_APTngihE';

  // Get necessary DOM elements
  const form = document.getElementById('imageForm');
  const promptInput = document.querySelector('input[name="prompt"]');
  const output = document.querySelector('.output');
  const similar_recipe = document.querySelector('.similar_recipe');
  const output_preview_1 = document.querySelector('.output_preview_1');
  const extraIngredientsDiv = document.getElementById('extraIngredientsDiv');
  const extraIngredientsInput = document.getElementById('extraIngredients');
  const imageUpload = document.getElementById('imageUpload');
  const cameraInput = document.getElementById('cameraInput');
  const loader = document.getElementById('loader');
  const notfound = document.getElementById('notfound');
  const startgenerate = document.getElementById('startgenerate');
  const uploadedImage = document.getElementById('uploadedImage');
  const regenerate = document.querySelector('button[name="regenerate"]');
  const submit = document.querySelector('button[name="submit"]');
  const answer = document.querySelector('input[name="answer"]');
  const copy = document.querySelector('button[name="copy"]');
  const preview_recipe_1 = document.getElementById('preview_recipe_1');

  // Event listener for copy button
  copy.addEventListener('click', function () {
    var copyText = output.innerText;
    navigator.clipboard.writeText(copyText);
    alert("Copied!");
  })

  // Event listener for regenerate button
  regenerate.addEventListener('click', function () {
    output.innerHTML = '';
    loader.style.display = 'block';
  })

  // Function to handle form submission
  async function handleSubmit(file, prompt) {
    // Display loader and hide certain elements
    loader.style.display = 'block';
    notfound.setAttribute('hidden', 'hidden');
    extraIngredientsDiv.style.display = 'flex';
    incompatible.style.display = 'block';
    startgenerate.setAttribute('hidden', 'hidden');

    try {
      // Read image file
      const reader = new FileReader();
      reader.onloadend = async function () {
        let imageBase64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");

        // Define contents for AI model
        let contents = [{
          role: 'user',
          parts: [{
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64
              }
            },
            {
              text: prompt
            }
          ]
        }];

        // Initialize Google Generative AI model
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
          safetySettings: [{
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          }, ],
        });

        // Generate content stream
        const result = await model.generateContentStream({
          contents
        });

        // Render generated content
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

    // Same process for generating preview recipe
    try {
      const reader = new FileReader();
      reader.onloadend = async function () {
        let imageBase64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
        let contents = [{
          role: 'user',
          parts: [{
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64
              }
            },
            {
              text: "Ensure it's different from:" + prompt + " and " + output_preview_1.innerHTML.toString() + "Provide just a name for a similar dish using the same ingredients"
            }
          ]
        }];

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
          safetySettings: [{
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
          ],
        });

        const result = await model.generateContentStream({
          contents
        });

        let buffer = [];
        let md = new MarkdownIt();
        for await (let response of result.stream) {
          buffer.push(response.text());
          const sanitizedHtml = DOMPurify.sanitize(buffer.join(''));
          output_preview_1.innerHTML = md.render(sanitizedHtml);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      output_preview_1.innerHTML += '<hr>' + e;
    }
  }

  // Event listener for form submission
  form.onsubmit = (ev) => {
    ev.preventDefault();

    // Get image file
    const imageFile = imageUpload.files[0] || cameraInput.files[0];
    if (imageFile) {
      // Hide loader and show elements
      loader.style.display = 'none';
      extraIngredientsDiv.style.display = 'block';
      uploadedImage.style.display = 'none';
      handleSubmit(imageFile, promptInput.value);

      similar_recipe.removeAttribute('hidden');
      regenerate.removeAttribute('hidden');
      copy.removeAttribute('hidden');
      submit.setAttribute('hidden', 'hidden');
    } else {
      notfound.removeAttribute('hidden');
      startgenerate.setAttribute('hidden', 'hidden');
    }
  };

  // Event listener for image upload change
  imageUpload.addEventListener('change', () => {
    if (imageUpload.files.length > 0) {
      cameraInput.value = '';
    }
  });

  // Event listener for camera input change
  cameraInput.addEventListener('change', () => {
    if (cameraInput.files.length > 0) {
      imageUpload.value = '';
    }
  });

  // Show API key banner
  maybeShowApiKeyBanner(API_KEY);

  // Event listener for dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('rotate');
  });

  // Typing animation
  const typingText = document.getElementById('typing-text');
  const prefix = "Hello!\n";
  const suffix = "How can I help you today?";
  let index = 0;
  let direction = 1;

  function type() {
    if (direction === 1) {
      typingText.textContent = prefix + suffix.substring(0, index);
      index++;
      if (index === suffix.length + 1) {
        direction = -1;
      }
    } else {
      typingText.textContent = prefix + suffix.substring(0, index);
      index--;
      if (index === 0) {
        direction = 1;
      }
    }
  }
  setInterval(type, 100);

  // Event listener for image upload change to display the uploaded image
  imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle camera input change event to hide the uploaded image
  cameraInput.addEventListener('change', () => {
    uploadedImage.style.display = 'none';
  });

  // Function to update recipe
  async function updateRecipe() {
    const extraIngredients = extraIngredientsInput.value;
    if (!extraIngredients) {
      alert("Please enter additional ingredients.");
      return;
    }
    promptInput.value += "Include the following changes to the recipe, either the ingredients: ";
    promptInput.value += `, ${extraIngredients}`;
    const file = imageUpload.files[0] || cameraInput.files[0];
    if (file) {
      handleSubmit(file, promptInput.value);
      console.log(promptInput.value)
    }
  }

  // Function to preview recipe
  async function previewRecipe(recipeName) {
    const sanitizedRecipeName = recipeName.replace(/<\/?[^>]+(>|$)/g, "");
    promptInput.value = "Generate a recipe of " + sanitizedRecipeName + ", the name of the recipe you have provided, the nutritional facts of the recipe and the meal size (estimation of how many number of people it can cater to):";
    const file = imageUpload.files[0] || cameraInput.files[0];
    if (file) {
      handleSubmit(file, promptInput.value);
      console.log(promptInput.value)
    }
  }

  // Event listeners for update and preview buttons
  const updateButton = document.getElementById('updateButton');
  updateButton.addEventListener('click', updateRecipe);
  preview_recipe_1.addEventListener('click', () => previewRecipe(output_preview_1.innerHTML.toString()));

  // Function to call an API function with retry
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