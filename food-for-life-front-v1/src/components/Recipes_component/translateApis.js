import axios from 'axios';

const translateText = async (text, targetLanguage) => {
    const apiKey = 'AIzaSyCQYwPuGifUdqMUEJtOOziVQy7Ne9wcAFg';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await axios.post(url, {
        q: text,
        target: targetLanguage,
    });
    return response.data.data.translations[0].translatedText;
};

export default translateText;