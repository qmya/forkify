import { async } from 'regenerator-runtime/runtime'; //polyfilling async await
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //Here we added Promise.race so who ever run the race first will be executed first

    //always we convert the response into json
    const data = await res.json();
    //if the id is not right than throw a new error
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
    console.log(res, data);
  } catch (error) {
    throw error;
  }
};
